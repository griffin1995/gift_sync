#!/usr/bin/env python3
"""
End-to-end test for GiftSync user flow
Tests the complete journey from user onboarding to recommendations
"""

import requests
import json
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional

API_BASE_URL = "http://localhost:8000"

class GiftSyncE2ETest:
    def __init__(self):
        self.session = requests.Session()
        self.user_id = str(uuid.uuid4())  # Use proper UUID
        self.session_id = None
        self.swipe_count = 0
        self.recommendations = []
        
    def log(self, message: str, status: str = "INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {status}: {message}")
        
    def test_health_check(self) -> bool:
        """Test 1: Verify API is healthy"""
        try:
            response = self.session.get(f"{API_BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                self.log(f"PASS API Health Check - Status: {data['status']}")
                return True
            else:
                self.log(f"FAIL Health check failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Health check error: {e}", "ERROR")
            return False
            
    def test_load_categories(self) -> bool:
        """Test 2: Load available categories"""
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/categories", 
                                      params={"limit": 10, "active_only": True})
            if response.status_code == 200:
                categories = response.json()
                self.log(f"PASS Categories loaded: {len(categories)} available")
                self.categories = categories
                if categories:
                    self.log(f"   Sample category: {categories[0]['name']}")
                return True
            else:
                self.log(f"FAIL Categories load failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Categories load error: {e}", "ERROR")
            return False
            
    def test_load_products(self) -> bool:
        """Test 3: Load products for swiping"""
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/products", 
                                      params={"limit": 20})
            if response.status_code == 200:
                products = response.json()
                self.log(f"PASS Products loaded: {len(products)} available for swiping")
                self.products = products
                if products:
                    product = products[0]
                    self.log(f"   Sample product: {product['title']} - {product.get('price_min', 'N/A')}")
                return True
            else:
                self.log(f"FAIL Products load failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Products load error: {e}", "ERROR")
            return False
            
    def test_create_swipe_session(self) -> bool:
        """Test 4: Create a swipe session"""
        try:
            session_data = {
                "user_id": self.user_id,
                "session_type": "discovery",
                "budget_min": 20.0,
                "budget_max": 100.0,
                "recipient_relationship": "friend"
            }
            
            response = self.session.post(f"{API_BASE_URL}/api/v1/swipe-sessions", 
                                       json=session_data)
            if response.status_code == 200:
                session = response.json()
                self.session_id = session['id']
                self.log(f"PASS Swipe session created: {self.session_id}")
                return True
            else:
                self.log(f"FAIL Session creation failed: {response.status_code}", "ERROR")
                self.log(f"   Response: {response.text}")
                return False
        except Exception as e:
            self.log(f"FAIL Session creation error: {e}", "ERROR")
            return False
            
    def test_simulate_swiping(self) -> bool:
        """Test 5: Simulate user swiping on products"""
        if not self.session_id or not hasattr(self, 'products'):
            self.log("FAIL Cannot simulate swiping - missing session or products", "ERROR")
            return False
            
        try:
            swipe_patterns = ['right', 'left', 'right', 'up', 'left', 'right', 'left', 'right']
            products_to_swipe = self.products[:len(swipe_patterns)]
            
            for i, (product, direction) in enumerate(zip(products_to_swipe, swipe_patterns)):
                interaction_data = {
                    "session_id": self.session_id,
                    "user_id": self.user_id,
                    "swipe_direction": direction,
                    "product_id": product['id'],
                    "category_id": product.get('category_id'),
                    "time_spent_seconds": 3,
                    "preference_strength": 0.8 if direction in ['right', 'up'] else 0.2
                }
                
                response = self.session.post(f"{API_BASE_URL}/api/v1/swipe-interactions", 
                                           json=interaction_data)
                if response.status_code == 200:
                    self.swipe_count += 1
                    if i == 0:  # Log first swipe details
                        self.log(f"PASS Swipe interaction recorded: {direction} on {product['title'][:30]}...")
                else:
                    self.log(f"FAIL Swipe {i+1} failed: {response.status_code}", "ERROR")
                    return False
                    
                # Small delay to simulate real usage
                time.sleep(0.1)
                
            self.log(f"PASS Completed {self.swipe_count} swipe interactions")
            return True
            
        except Exception as e:
            self.log(f"FAIL Swiping simulation error: {e}", "ERROR")
            return False
            
    def test_get_session_interactions(self) -> bool:
        """Test 6: Retrieve session interactions"""
        if not self.session_id:
            self.log("FAIL Cannot get interactions - missing session", "ERROR")
            return False
            
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/sessions/{self.session_id}/interactions")
            if response.status_code == 200:
                interactions = response.json()
                self.log(f"PASS Retrieved {len(interactions)} interactions from session")
                
                # Analyze preferences
                likes = [i for i in interactions if i['swipe_direction'] in ['right', 'up']]
                dislikes = [i for i in interactions if i['swipe_direction'] == 'left']
                self.log(f"   Preferences: {len(likes)} likes, {len(dislikes)} dislikes")
                return True
            else:
                self.log(f"FAIL Get interactions failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Get interactions error: {e}", "ERROR")
            return False
            
    def test_create_recommendations(self) -> bool:
        """Test 7: Generate recommendations based on swipes"""
        try:
            # Create a few sample recommendations
            for i, product in enumerate(self.products[:3]):
                rec_data = {
                    "user_id": self.user_id,
                    "product_id": product['id'],
                    "session_id": self.session_id,
                    "confidence_score": 0.85 - (i * 0.1),
                    "algorithm_version": "hybrid_v1",
                    "reasoning": f"Based on your interest in {product.get('category_id', 'similar products')}"
                }
                
                response = self.session.post(f"{API_BASE_URL}/api/v1/recommendations", 
                                           json=rec_data)
                if response.status_code == 200:
                    recommendation = response.json()
                    self.recommendations.append(recommendation)
                    
            self.log(f"PASS Created {len(self.recommendations)} recommendations")
            return True
            
        except Exception as e:
            self.log(f"FAIL Recommendations creation error: {e}", "ERROR")
            return False
            
    def test_get_user_recommendations(self) -> bool:
        """Test 8: Retrieve user recommendations"""
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/users/{self.user_id}/recommendations",
                                      params={"limit": 10})
            if response.status_code == 200:
                recommendations = response.json()
                self.log(f"PASS Retrieved {len(recommendations)} recommendations for user")
                if recommendations:
                    rec = recommendations[0]
                    self.log(f"   Top recommendation: confidence {rec['confidence_score']}")
                return True
            else:
                self.log(f"FAIL Get recommendations failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Get recommendations error: {e}", "ERROR")
            return False
            
    def test_create_gift_link(self) -> bool:
        """Test 9: Create shareable gift link"""
        try:
            link_data = {
                "user_id": self.user_id,
                "session_id": self.session_id,
                "title": "My Gift Recommendations",
                "message": "Check out these amazing gift ideas I found!",
                "recipient_name": "Friend"
            }
            
            response = self.session.post(f"{API_BASE_URL}/api/v1/gift-links", 
                                       json=link_data)
            if response.status_code == 200:
                gift_link = response.json()
                self.gift_link_token = gift_link['link_token']
                self.log(f"PASS Gift link created: {self.gift_link_token}")
                self.log(f"   Gift link data: {gift_link}")
                return True
            else:
                self.log(f"FAIL Gift link creation failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Gift link creation error: {e}", "ERROR")
            return False
            
    def test_access_gift_link(self) -> bool:
        """Test 10: Access gift link"""
        if not hasattr(self, 'gift_link_token'):
            self.log("FAIL Cannot access gift link - not created", "ERROR")
            return False
            
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/gift-links/{self.gift_link_token}")
            if response.status_code == 200:
                gift_link = response.json()
                self.log(f"PASS Gift link accessed successfully")
                self.log(f"   Title: {gift_link.get('title', 'N/A')}")
                return True
            else:
                self.log(f"FAIL Gift link access failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Gift link access error: {e}", "ERROR")
            return False
            
    def test_analytics_dashboard(self) -> bool:
        """Test 11: Check analytics dashboard"""
        try:
            response = self.session.get(f"{API_BASE_URL}/api/v1/analytics/dashboard")
            if response.status_code == 200:
                analytics = response.json()
                self.log(f"PASS Analytics dashboard accessed")
                self.log(f"   Total interactions: {analytics.get('total_interactions', 0)}")
                self.log(f"   Total sessions: {analytics.get('total_sessions', 0)}")
                return True
            else:
                self.log(f"FAIL Analytics access failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"FAIL Analytics access error: {e}", "ERROR")
            return False
            
    def run_complete_test(self) -> bool:
        """Run the complete end-to-end test suite"""
        self.log("Starting GiftSync End-to-End Test Suite")
        self.log(f"   Test User ID: {self.user_id}")
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Load Categories", self.test_load_categories),
            ("Load Products", self.test_load_products),
            ("Create Swipe Session", self.test_create_swipe_session),
            ("Simulate Swiping", self.test_simulate_swiping),
            ("Get Session Interactions", self.test_get_session_interactions),
            ("Create Recommendations", self.test_create_recommendations),
            ("Get User Recommendations", self.test_get_user_recommendations),
            ("Create Gift Link", self.test_create_gift_link),
            ("Access Gift Link", self.test_access_gift_link),
            ("Analytics Dashboard", self.test_analytics_dashboard),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            self.log(f"\n--- Testing: {test_name} ---")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log(f"FAIL {test_name} crashed: {e}", "ERROR")
                failed += 1
        
        # Summary
        total = passed + failed
        success_rate = (passed / total * 100) if total > 0 else 0
        
        self.log(f"\nRESULT TEST SUITE COMPLETE")
        self.log(f"   Passed: {passed}/{total} ({success_rate:.1f}%)")
        self.log(f"   Failed: {failed}/{total}")
        
        if failed == 0:
            self.log("SUCCESS ALL TESTS PASSED - GiftSync E2E flow is working!", "SUCCESS")
        else:
            self.log(f"WARNING  {failed} tests failed - needs investigation", "WARNING")
            
        return failed == 0

if __name__ == "__main__":
    tester = GiftSyncE2ETest()
    success = tester.run_complete_test()
    exit(0 if success else 1)