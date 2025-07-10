const axios = require('axios');

class SearchAPIService {
  constructor(apiKey, debug = false) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.searchapi.io/api/v1/search';
    this.debug = debug;
  }

  // Search the web using SearchAPI
  async searchWeb(query, options = {}) {
    try {
      if (this.debug) {
        console.log(`🔍 Searching the web for: "${query}"`);
      }

      const params = {
        api_key: this.apiKey,
        engine: 'google',
        q: query,
        ...options,
      };

      const response = await axios.get(this.baseUrl, {
        params,
        timeout: 15000,
      });

      if (response.data && response.data.search_metadata.status === 'Success') {
        return this.formatSearchResults(response.data);
      } else {
        throw new Error('Search API returned unsuccessful status');
      }
    } catch (error) {
      console.error('❌ Search API error:', error.message);
      return [];
    }
  }

  // Format search results for easy consumption
  formatSearchResults(data) {
    const results = [];

    // Add organic search results
    if (data.organic_results) {
      data.organic_results.forEach((result, index) => {
        results.push({
          type: 'organic',
          title: result.title,
          url: result.link,
          snippet: result.snippet,
          position: index + 1,
          source: 'SearchAPI',
        });
      });
    }

    // Add knowledge graph if available
    if (data.knowledge_graph) {
      results.push({
        type: 'knowledge_graph',
        title: data.knowledge_graph.title,
        description: data.knowledge_graph.description,
        url: data.knowledge_graph.source?.link,
        source: 'SearchAPI Knowledge Graph',
      });
    }

    // Add featured snippets if available
    if (data.answer_box) {
      results.push({
        type: 'featured_snippet',
        title: data.answer_box.title,
        snippet: data.answer_box.answer,
        url: data.answer_box.link,
        source: 'SearchAPI Featured Snippet',
      });
    }

    return results;
  }

  // Perform a comprehensive search with multiple result types
  async comprehensiveSearch(query, maxResults = 5) {
    const searchResults = await this.searchWeb(query, {
      num: maxResults,
      gl: 'us',
      hl: 'en',
    });

    return searchResults.slice(0, maxResults);
  }

  // Search for addresses using Google Maps engine
  async searchAddress(query, maxResults = 3) {
    try {
      if (this.debug) {
        console.log(`📍 Searching for address: "${query}"`);
      }

      const params = {
        api_key: this.apiKey,
        engine: 'google_maps',
        q: query,
        num: maxResults,
      };

      const response = await axios.get(this.baseUrl, {
        params,
        timeout: 15000,
      });

      if (response.data && response.data.search_metadata.status === 'Success') {
        return this.formatAddressResults(response.data);
      } else {
        throw new Error('Address search API returned unsuccessful status');
      }
    } catch (error) {
      console.error('❌ Address search API error:', error.message);
      return [];
    }
  }

  // Format address search results
  formatAddressResults(data) {
    const results = [];

    // Add local results (businesses, places)
    if (data.local_results) {
      data.local_results.forEach((result, index) => {
        results.push({
          type: 'local',
          title: result.title,
          address: result.address,
          phone: result.phone,
          website: result.website,
          rating: result.rating,
          reviews: result.reviews,
          hours: result.hours,
          position: index + 1,
          source: 'SearchAPI Google Maps',
        });
      });
    }

    // Add organic results if available
    if (data.organic_results) {
      data.organic_results.forEach((result, index) => {
        results.push({
          type: 'organic',
          title: result.title,
          url: result.link,
          snippet: result.snippet,
          position: index + 1,
          source: 'SearchAPI Google Maps',
        });
      });
    }

    return results;
  }

  // Check if the API key is valid
  async validateApiKey() {
    try {
      const testQuery = 'test';
      const results = await this.searchWeb(testQuery, { num: 1 });
      return results.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get search metadata for debugging
  async getSearchMetadata(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          api_key: this.apiKey,
          engine: 'google',
          q: query,
          num: 1,
        },
        timeout: 10000,
      });

      return response.data.search_metadata || null;
    } catch (error) {
      console.error('❌ Error getting search metadata:', error.message);
      return null;
    }
  }
}

module.exports = SearchAPIService;
