import 'dart:io';
import 'package:dio/dio.dart';

/// Simple test script to verify API connection
/// Run with: dart test_api_connection.dart
void main() async {
  print('🧪 Testing GiftSync API Connection...\n');
  
  final dio = Dio(BaseOptions(
    baseURL: 'http://localhost:8000',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  // Test 1: Health Check
  await testHealthEndpoint(dio);
  
  // Test 2: Categories
  await testCategoriesEndpoint(dio);
  
  // Test 3: Products
  await testProductsEndpoint(dio);
  
  // Test 4: Analytics Dashboard
  await testAnalyticsEndpoint(dio);
  
  print('\n✅ API Connection Tests Completed!');
}

Future<void> testHealthEndpoint(Dio dio) async {
  try {
    print('🔍 Testing /health endpoint...');
    final response = await dio.get('/health');
    
    if (response.statusCode == 200) {
      final data = response.data;
      print('   ✅ Health check successful');
      print('   📊 Status: ${data['status']}');
      print('   📅 Timestamp: ${data['timestamp']}');
      print('   🏷️  Version: ${data['version']}');
    } else {
      print('   ❌ Health check failed with status: ${response.statusCode}');
    }
  } catch (e) {
    print('   ❌ Health check error: $e');
  }
  print('');
}

Future<void> testCategoriesEndpoint(Dio dio) async {
  try {
    print('🔍 Testing /api/v1/categories endpoint...');
    final response = await dio.get('/api/v1/categories');
    
    if (response.statusCode == 200) {
      final List categories = response.data;
      print('   ✅ Categories fetched successfully');
      print('   📊 Total categories: ${categories.length}');
      
      if (categories.isNotEmpty) {
        final firstCategory = categories.first;
        print('   🏷️  First category: ${firstCategory['name']} (${firstCategory['slug']})');
      }
    } else {
      print('   ❌ Categories fetch failed with status: ${response.statusCode}');
    }
  } catch (e) {
    print('   ❌ Categories fetch error: $e');
  }
  print('');
}

Future<void> testProductsEndpoint(Dio dio) async {
  try {
    print('🔍 Testing /api/v1/products endpoint...');
    final response = await dio.get('/api/v1/products', queryParameters: {'limit': 5});
    
    if (response.statusCode == 200) {
      final List products = response.data;
      print('   ✅ Products fetched successfully');
      print('   📊 Total products: ${products.length}');
      
      if (products.isNotEmpty) {
        final firstProduct = products.first;
        print('   🎁 First product: ${firstProduct['title']}');
        print('   💰 Price: \$${firstProduct['price_min']}');
      }
    } else {
      print('   ❌ Products fetch failed with status: ${response.statusCode}');
    }
  } catch (e) {
    print('   ❌ Products fetch error: $e');
  }
  print('');
}

Future<void> testAnalyticsEndpoint(Dio dio) async {
  try {
    print('🔍 Testing /api/v1/analytics/dashboard endpoint...');
    final response = await dio.get('/api/v1/analytics/dashboard');
    
    if (response.statusCode == 200) {
      final data = response.data;
      print('   ✅ Analytics dashboard fetched successfully');
      print('   📊 Categories: ${data['total_categories']}');
      print('   🎁 Products: ${data['total_products']}');
      print('   💫 Sessions: ${data['total_sessions']}');
      print('   🔄 Interactions: ${data['total_interactions']}');
      print('   🌟 Status: ${data['status']}');
    } else {
      print('   ❌ Analytics fetch failed with status: ${response.statusCode}');
    }
  } catch (e) {
    print('   ❌ Analytics fetch error: $e');
  }
  print('');
}