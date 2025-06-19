"""
Database connection and utilities for GiftSync
"""
from typing import Optional
import httpx
from app.core.config import settings

class SupabaseClient:
    """Simple Supabase client for API operations"""
    
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.anon_key = settings.SUPABASE_ANON_KEY
        self.service_key = settings.SUPABASE_SERVICE_KEY
        
        if not all([self.url, self.anon_key, self.service_key]):
            raise ValueError("Supabase configuration missing. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_KEY environment variables.")
    
    def _get_headers(self, use_service_key: bool = False):
        """Get headers for Supabase API requests"""
        key = self.service_key if use_service_key else self.anon_key
        return {
            'apikey': key,
            'Authorization': f'Bearer {key}',
            'Content-Type': 'application/json'
        }
    
    async def select(self, table: str, select: str = "*", filters: Optional[dict] = None, limit: int = 100, use_service_key: bool = False):
        """Select data from a table"""
        url = f"{self.url}/rest/v1/{table}"
        params = {"select": select, "limit": limit}
        
        if filters:
            for key, value in filters.items():
                params[f"{key}"] = f"eq.{value}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self._get_headers(use_service_key), params=params)
            response.raise_for_status()
            return response.json()
    
    async def insert(self, table: str, data: dict, use_service_key: bool = False):
        """Insert data into a table"""
        url = f"{self.url}/rest/v1/{table}"
        headers = self._get_headers(use_service_key)
        headers['Prefer'] = 'return=representation'
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()
    
    async def update(self, table: str, data: dict, filters: dict, use_service_key: bool = False):
        """Update data in a table"""
        url = f"{self.url}/rest/v1/{table}"
        params = {}
        
        for key, value in filters.items():
            params[f"{key}"] = f"eq.{value}"
        
        headers = self._get_headers(use_service_key)
        headers['Prefer'] = 'return=representation'
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(url, headers=headers, params=params, json=data)
            response.raise_for_status()
            return response.json()

# Global instance
supabase = SupabaseClient()