// src/app/perplexity.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, query as firestoreQuery, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXvBFLTn6H7W9mrPXxjk6fGT3NtEHfW7E",
  authDomain: "aura-smart-search.firebaseapp.com",
  projectId: "aura-smart-search",
  storageBucket: "aura-smart-search.firebasestorage.app",
  messagingSenderId: "303205789665",
  appId: "1:303205789665:web:73cb698ae4e1e860832ca0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface SearchResult {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {
  private readonly API_KEY_STORAGE_KEY = 'perplexity_api_key';

  generateUniqueId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 11; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async saveSearch(queryText: string, response: string): Promise<string> {
    const uniqueId = this.generateUniqueId();
    const searchesRef = collection(db, 'searches');
    
    const queryRef = firestoreQuery(searchesRef, where("id", "==", uniqueId));
    const querySnapshot = await getDocs(queryRef);
    
    if (!querySnapshot.empty) {
      return this.saveSearch(queryText, response);
    }

    await addDoc(searchesRef, {
      id: uniqueId,
      query: queryText,
      response,
      timestamp: new Date()
    });
    return uniqueId;
  }

  async getSearch(id: string): Promise<SearchResult | null> {
    const searchesRef = collection(db, 'searches');
    const queryRef = firestoreQuery(searchesRef, where("id", "==", id));
    const querySnapshot = await getDocs(queryRef);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return data as SearchResult;
    }
    return null;
  }

  saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  getApiKey(): string {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY) || '';
  }

  async search(query: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('API key not found');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user."
          },
          {
            role: "user",
            content: query
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }
    
    return data.choices[0].message.content;
  }
}