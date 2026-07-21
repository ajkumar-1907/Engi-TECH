import requests
import sys
import json
from datetime import datetime

class EngiTechAPITester:
    def __init__(self, base_url="https://branch-machines.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.user_token = None
        self.test_equipment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, cookies=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        
        # Merge headers
        test_headers = self.session.headers.copy()
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, cookies=cookies)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers, cookies=cookies)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")

            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "email": "test@student.com",
            "password": "test123",
            "name": "Test Student"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and response:
            # Store cookies for future requests
            self.session.cookies.update(response.cookies)
            print("   User registration cookies stored")
        
        return success

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": "test@student.com",
            "password": "test123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and response:
            # Store cookies for future requests
            self.session.cookies.update(response.cookies)
            print("   User login cookies stored")
        
        return success

    def test_admin_login(self):
        """Test admin login"""
        admin_data = {
            "email": "admin@engitech.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_data
        )
        
        if success and response:
            # Store cookies for future requests
            self.session.cookies.update(response.cookies)
            print("   Admin login cookies stored")
        
        return success

    def test_get_current_user(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_equipment_all(self):
        """Test get all equipment"""
        success, response = self.run_test(
            "Get All Equipment",
            "GET",
            "equipment",
            200
        )
        return success

    def test_get_equipment_by_branch(self):
        """Test get equipment by branch"""
        success, response = self.run_test(
            "Get Equipment by Branch (mechanical)",
            "GET",
            "equipment?branch=mechanical",
            200
        )
        return success

    def test_search_equipment(self):
        """Test search equipment"""
        success, response = self.run_test(
            "Search Equipment (lathe)",
            "GET",
            "equipment?search=lathe",
            200
        )
        return success

    def test_get_equipment_by_id(self):
        """Test get equipment by ID - first get equipment list to find an ID"""
        # First get equipment list
        success, response = self.run_test(
            "Get Equipment List for ID Test",
            "GET",
            "equipment",
            200
        )
        
        if success and response:
            try:
                equipment_list = response.json()
                if equipment_list and len(equipment_list) > 0:
                    equipment_id = equipment_list[0]['id']
                    self.test_equipment_id = equipment_id
                    
                    success, response = self.run_test(
                        f"Get Equipment by ID ({equipment_id})",
                        "GET",
                        f"equipment/{equipment_id}",
                        200
                    )
                    return success
                else:
                    print("❌ No equipment found to test by ID")
                    return False
            except Exception as e:
                print(f"❌ Error parsing equipment list: {e}")
                return False
        
        return False

    def test_create_equipment_admin(self):
        """Test create equipment (admin only)"""
        new_equipment = {
            "name": "Test Equipment",
            "branch": "mechanical",
            "definition": "A test equipment for testing purposes",
            "working_principle": "Works by testing principles",
            "main_parts": ["Part 1", "Part 2", "Part 3"],
            "applications": ["Testing", "Validation", "Quality Assurance"],
            "exam_notes": "Remember this is just for testing",
            "image_url": "https://example.com/test-image.jpg"
        }
        
        success, response = self.run_test(
            "Create Equipment (Admin)",
            "POST",
            "equipment",
            200,
            data=new_equipment
        )
        
        if success and response:
            try:
                created_equipment = response.json()
                self.test_equipment_id = created_equipment.get('id')
                print(f"   Created equipment ID: {self.test_equipment_id}")
            except:
                pass
        
        return success

    def test_update_equipment_admin(self):
        """Test update equipment (admin only)"""
        if not self.test_equipment_id:
            print("❌ No test equipment ID available for update test")
            return False
            
        update_data = {
            "name": "Updated Test Equipment",
            "definition": "An updated test equipment for testing purposes"
        }
        
        success, response = self.run_test(
            f"Update Equipment (Admin) - ID: {self.test_equipment_id}",
            "PUT",
            f"equipment/{self.test_equipment_id}",
            200,
            data=update_data
        )
        
        return success

    def test_bookmark_equipment(self):
        """Test bookmark toggle functionality"""
        if not self.test_equipment_id:
            print("❌ No test equipment ID available for bookmark test")
            return False
            
        success, response = self.run_test(
            f"Toggle Bookmark - ID: {self.test_equipment_id}",
            "POST",
            f"bookmarks/{self.test_equipment_id}",
            200
        )
        
        return success

    def test_get_bookmarks(self):
        """Test get user bookmarks"""
        success, response = self.run_test(
            "Get User Bookmarks",
            "GET",
            "bookmarks",
            200
        )
        
        return success

    def test_delete_equipment_admin(self):
        """Test delete equipment (admin only)"""
        if not self.test_equipment_id:
            print("❌ No test equipment ID available for delete test")
            return False
            
        success, response = self.run_test(
            f"Delete Equipment (Admin) - ID: {self.test_equipment_id}",
            "DELETE",
            f"equipment/{self.test_equipment_id}",
            200
        )
        
        return success

    def test_logout(self):
        """Test logout"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        
        if success:
            # Clear cookies
            self.session.cookies.clear()
            print("   Cookies cleared")
        
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        # Clear cookies first
        self.session.cookies.clear()
        
        success, response = self.run_test(
            "Unauthorized Access to Bookmarks",
            "GET",
            "bookmarks",
            401
        )
        
        return success

def main():
    print("🚀 Starting EngiTech API Testing...")
    print("=" * 60)
    
    tester = EngiTechAPITester()
    
    # Test sequence
    test_results = []
    
    # 1. Test user registration and login
    print("\n📝 TESTING USER AUTHENTICATION")
    test_results.append(("User Registration", tester.test_user_registration()))
    test_results.append(("User Login", tester.test_user_login()))
    test_results.append(("Get Current User", tester.test_get_current_user()))
    
    # 2. Test equipment endpoints (as user)
    print("\n🔧 TESTING EQUIPMENT ENDPOINTS (USER)")
    test_results.append(("Get All Equipment", tester.test_get_equipment_all()))
    test_results.append(("Get Equipment by Branch", tester.test_get_equipment_by_branch()))
    test_results.append(("Search Equipment", tester.test_search_equipment()))
    test_results.append(("Get Equipment by ID", tester.test_get_equipment_by_id()))
    
    # 3. Test bookmark functionality (as user)
    print("\n🔖 TESTING BOOKMARK FUNCTIONALITY")
    test_results.append(("Toggle Bookmark", tester.test_bookmark_equipment()))
    test_results.append(("Get Bookmarks", tester.test_get_bookmarks()))
    
    # 4. Test admin functionality
    print("\n👑 TESTING ADMIN FUNCTIONALITY")
    test_results.append(("Admin Login", tester.test_admin_login()))
    test_results.append(("Create Equipment (Admin)", tester.test_create_equipment_admin()))
    test_results.append(("Update Equipment (Admin)", tester.test_update_equipment_admin()))
    test_results.append(("Delete Equipment (Admin)", tester.test_delete_equipment_admin()))
    
    # 5. Test logout and unauthorized access
    print("\n🚪 TESTING LOGOUT AND SECURITY")
    test_results.append(("Logout", tester.test_logout()))
    test_results.append(("Unauthorized Access", tester.test_unauthorized_access()))
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n📈 Overall: {tester.tests_passed}/{tester.tests_run} tests passed")
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📊 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())