const OpenAI = require('openai');
const PromptProcessor = require('../utils/PromptProcessor');
const SearchAPIService = require('../services/SearchAPIService');

class ChatManager {
  constructor(apiKey, searchApiKey = null, debug = false) {
    this.openai = new OpenAI({ apiKey });
    this.conversationHistory = [];
    this.promptProcessor = new PromptProcessor();
    this.systemPrompt = '';
    this.searchService = searchApiKey
      ? new SearchAPIService(searchApiKey, debug)
      : null;
    this.debug = debug;
  }

  // Initialize system prompt
  async initializeSystemPrompt() {
    this.systemPrompt = await this.promptProcessor.getProcessedPrompt();
  }

  // Send a message to ChatGPT with streaming and tool-based web search
  async chat(message, options = {}) {
    const {
      model = 'gpt-4o',
      temperature = 0.7,
      maxTokens = 1000,
      stream = true,
      enableWebSearch = true,
    } = options;

    // Initialize system prompt if not already done
    if (!this.systemPrompt) {
      await this.initializeSystemPrompt();
    }

    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Prepare messages with system prompt
    const messages = [
      {
        role: 'system',
        content: this.systemPrompt,
      },
      ...this.conversationHistory,
    ];

    // Define tools for web search
    const tools =
      enableWebSearch && this.searchService
        ? [
            {
              type: 'function',
              function: {
                name: 'search_web',
                description:
                  'Search the web for current information, news, or real-time data. ALWAYS use this function when the user asks for: current events, recent news, weather, stock prices, live data, latest updates, information that may have changed recently, or any query that requires up-to-date information. This is your primary tool for getting current information.',
                parameters: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description:
                        'The search query to find current information. Make this specific and relevant to what the user is asking.',
                    },
                    max_results: {
                      type: 'number',
                      description:
                        'Maximum number of results to return (default: 3)',
                      default: 3,
                    },
                  },
                  required: ['query'],
                },
              },
            },
            {
              type: 'function',
              function: {
                name: 'search_address',
                description:
                  'Search for address details, location information, business addresses, or geographic data. Use this function when users ask for: specific addresses, business locations, directions, place details, or any location-related information that requires precise address data.',
                parameters: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description:
                        'The address, business name, or location to search for. Be specific and include city/state if possible.',
                    },
                    max_results: {
                      type: 'number',
                      description:
                        'Maximum number of results to return (default: 3)',
                      default: 3,
                    },
                  },
                  required: ['query'],
                },
              },
            },
          ]
        : undefined;

    if (this.debug) {
      console.log(`🔧 Tools available: ${tools ? 'Yes' : 'No'}`);
      console.log(`🔧 Web search enabled: ${enableWebSearch}`);
      console.log(
        `🔧 Search service available: ${this.searchService ? 'Yes' : 'No'}`
      );
    }

    try {
      // For tool calls, use non-streaming to avoid accumulation issues
      if (tools && enableWebSearch && this.searchService) {
        if (this.debug) {
          console.log('🔧 Using non-streaming for tool calls...');
        }

        const response = await this.openai.chat.completions.create({
          model: model,
          messages: messages,
          tools: tools,
          tool_choice: 'auto',
          temperature: temperature,
          max_tokens: maxTokens,
          stream: false,
        });

        const choice = response.choices[0];

        if (choice.tool_calls && choice.tool_calls.length > 0) {
          if (this.debug) {
            console.log(`🔧 Detected ${choice.tool_calls.length} tool call(s)`);
          }
          await this.handleToolCalls(
            choice.tool_calls,
            messages,
            model,
            temperature,
            maxTokens
          );
          return choice.message.content || '';
        } else {
          // No tool calls, but we should still stream with tools available
          if (this.debug) {
            console.log(
              '🔧 No tool calls detected, streaming response with tools available...'
            );
          }
          return await this.streamResponseWithTools(
            messages,
            model,
            temperature,
            maxTokens,
            tools
          );
        }
      } else {
        // No tools available, use streaming
        return await this.streamResponse(
          messages,
          model,
          temperature,
          maxTokens
        );
      }
    } catch (error) {
      // If function calling fails, try without tools
      if (
        error.message.includes('function') ||
        error.message.includes('tool')
      ) {
        if (this.debug) {
          console.log(
            '⚠️  Function calling not supported, falling back to regular chat...'
          );
        }
        return await this.streamResponse(
          messages,
          model,
          temperature,
          maxTokens
        );
      } else {
        console.error('❌ Error communicating with ChatGPT:', error.message);
        throw error;
      }
    }
  }

  // Stream response without tools
  async streamResponse(messages, model, temperature, maxTokens) {
    const stream = await this.openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        process.stdout.write(content);
        fullResponse += content;
      }
    }

    console.log('\n'); // Add newline after response

    // Add assistant response to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
    });

    return fullResponse;
  }

  // Stream response with tools available
  async streamResponseWithTools(
    messages,
    model,
    temperature,
    maxTokens,
    tools
  ) {
    if (this.debug) {
      console.log('🔧 Starting stream with tools available...');
    }

    const stream = await this.openai.chat.completions.create({
      model: model,
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
      temperature: temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    let fullResponse = '';
    let hasToolCalls = false;
    let toolCalls = [];

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      // Handle content
      if (delta?.content) {
        process.stdout.write(delta.content);
        fullResponse += delta.content;
      }

      // Handle tool calls
      if (delta?.tool_calls) {
        if (this.debug) {
          console.log('🔧 Tool call detected in stream!');
        }
        hasToolCalls = true;
        for (const toolCall of delta.tool_calls) {
          if (toolCall.index !== undefined) {
            if (!toolCalls[toolCall.index]) {
              toolCalls[toolCall.index] = { ...toolCall };
            } else {
              // Merge tool call data
              if (toolCall.function?.arguments) {
                toolCalls[toolCall.index].function =
                  toolCalls[toolCall.index].function || {};
                toolCalls[toolCall.index].function.arguments =
                  (toolCalls[toolCall.index].function.arguments || '') +
                  toolCall.function.arguments;
              }
            }
          }
        }
      }
    }

    // If tool calls were detected during streaming, handle them
    if (this.debug) {
      console.log('\n');
    } // Add newline after response
    if (hasToolCalls && toolCalls.length > 0) {
      if (this.debug) {
        console.log(
          `🔧 Detected ${toolCalls.length} tool call(s) during streaming`
        );
        console.log('🔧 Tool calls:', JSON.stringify(toolCalls, null, 2));
      }
      await this.handleToolCalls(
        toolCalls,
        messages,
        model,
        temperature,
        maxTokens
      );
      return fullResponse;
    } else {
      if (this.debug) {
        console.log('🔧 No tool calls detected during streaming');
      }
    }

    // Add assistant response to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
    });

    return fullResponse;
  }

  // Handle tool calls from the AI
  async handleToolCalls(toolCalls, messages, model, temperature, maxTokens) {
    if (this.debug) {
      console.log(`🔧 Processing ${toolCalls.length} tool call(s)`, toolCalls);
    }

    for (const toolCall of toolCalls) {
      if (this.debug) {
        console.log(`🔧 Tool call: ${toolCall.function?.name}`);
        console.log(`🔧 Arguments: ${toolCall.function?.arguments}`);
      }

      if (toolCall.function?.name === 'search_web') {
        try {
          // Safely parse arguments
          let args;
          try {
            args = JSON.parse(toolCall.function.arguments);
            if (this.debug) {
              console.log(`🔧 Parsed args:`, args);
            }
          } catch (parseError) {
            console.error(
              '❌ Error parsing tool call arguments:',
              parseError.message
            );
            if (this.debug) {
              console.log('Raw arguments:', toolCall.function.arguments);
            }
            continue;
          }

          if (!args.query) {
            console.error('❌ No query provided in tool call');
            continue;
          }

          if (this.debug) {
            console.log(`🔍 Executing search for: "${args.query}"`);
          }
          const searchResults = await this.performWebSearch(
            args.query,
            args.max_results || 3
          );
          if (this.debug) {
            console.log(`🔍 Found ${searchResults.length} search results`);
          }

          // Add tool call to messages
          messages.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall],
          });

          // Add tool result to messages
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(searchResults),
          });

          // Get final response with search results
          if (this.debug) {
            console.log(`🤖 Getting final response with search results...`);
          }
          const finalResponse = await this.openai.chat.completions.create({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: true,
          });

          let finalContent = '';
          for await (const chunk of finalResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              process.stdout.write(content);
              finalContent += content;
            }
          }

          console.log('\n'); // Add newline after response

          // Add final assistant response to conversation history
          this.conversationHistory.push({
            role: 'assistant',
            content: finalContent,
          });
        } catch (error) {
          console.error('❌ Error handling tool call:', error.message);
          if (this.debug) {
            console.error(
              'Tool call details:',
              JSON.stringify(toolCall, null, 2)
            );
          }
        }
      } else if (toolCall.function?.name === 'search_address') {
        try {
          // Safely parse arguments
          let args;
          try {
            args = JSON.parse(toolCall.function.arguments);
            if (this.debug) {
              console.log(`🔧 Parsed address search args:`, args);
            }
          } catch (parseError) {
            console.error(
              '❌ Error parsing address search arguments:',
              parseError.message
            );
            if (this.debug) {
              console.log('Raw arguments:', toolCall.function.arguments);
            }
            continue;
          }

          if (!args.query) {
            console.error('❌ No query provided in address search');
            continue;
          }

          if (this.debug) {
            console.log(`📍 Executing address search for: "${args.query}"`);
          }
          const addressResults = await this.performAddressSearch(
            args.query,
            args.max_results || 3
          );
          if (this.debug) {
            console.log(`📍 Found ${addressResults.length} address results`);
          }
          console.log(`📍 Found ${addressResults.length} address results`);

          // Add tool call to messages
          messages.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall],
          });

          // Add tool result to messages
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(addressResults),
          });

          // Get final response with address results
          if (this.debug) {
            console.log(`🤖 Getting final response with address results...`);
          }
          const finalResponse = await this.openai.chat.completions.create({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: true,
          });

          let finalContent = '';
          for await (const chunk of finalResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              process.stdout.write(content);
              finalContent += content;
            }
          }

          console.log('\n'); // Add newline after response

          // Add final assistant response to conversation history
          this.conversationHistory.push({
            role: 'assistant',
            content: finalContent,
          });
        } catch (error) {
          console.error(
            '❌ Error handling address search tool call:',
            error.message
          );
          if (this.debug) {
            console.error(
              'Tool call details:',
              JSON.stringify(toolCall, null, 2)
            );
          }
        }
      } else {
        if (this.debug) {
          console.log(`⚠️  Unknown tool call: ${toolCall.function?.name}`);
        }
      }
    }
  }

  // Perform web search using SearchAPI
  async performWebSearch(query, maxResults = 3) {
    if (!this.searchService) {
      return [];
    }

    if (this.debug) {
      console.log(`🔍 Searching the web for: "${query}"`);
    }

    try {
      const searchResults = await this.searchService.comprehensiveSearch(
        query,
        maxResults
      );
      return searchResults;
    } catch (error) {
      console.error('❌ Search API error:', error.message);
      return [];
    }
  }

  // Perform address search using SearchAPI with Google Maps engine
  async performAddressSearch(query, maxResults = 3) {
    if (!this.searchService) {
      return [];
    }

    if (this.debug) {
      console.log(`📍 Searching for address: "${query}"`);
    }

    try {
      const addressResults = await this.searchService.searchAddress(
        query,
        maxResults
      );
      return addressResults;
    } catch (error) {
      console.error('❌ Address search API error:', error.message);
      return [];
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    if (this.debug) {
      console.log('🗑️  Conversation history cleared');
    }
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory;
  }

  // Get conversation history as formatted string
  getHistoryAsString() {
    return this.conversationHistory
      .map((msg, index) => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
        return `${index + 1}. ${role}: ${msg.content.substring(0, 100)}${
          msg.content.length > 100 ? '...' : ''
        }`;
      })
      .join('\n');
  }

  // Get conversation count
  getConversationCount() {
    return this.conversationHistory.length;
  }

  // Get current date info
  getCurrentDateInfo() {
    return this.promptProcessor.getDateInfo();
  }

  // Refresh system prompt (useful for long-running sessions)
  async refreshSystemPrompt() {
    await this.initializeSystemPrompt();
  }

  // Check if search functionality is available
  hasSearchCapability() {
    return this.searchService !== null;
  }

  // Test search functionality
  async testSearch(query = 'test') {
    if (!this.searchService) {
      return false;
    }

    try {
      const results = await this.searchService.searchWeb(query, { num: 1 });
      return results.length > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ChatManager;
