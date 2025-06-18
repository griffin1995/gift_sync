import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/user_model.dart';
import '../models/product_model.dart';
import '../models/swipe_model.dart';
import '../models/recommendation_model.dart';

part 'api_client.g.dart';

@RestApi()
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  // Authentication endpoints
  @POST('/auth/login')
  Future<AuthResponse> login(@Body() LoginRequest request);

  @POST('/auth/register')
  Future<AuthResponse> register(@Body() RegisterRequest request);

  @POST('/auth/refresh')
  Future<AuthResponse> refreshToken(@Body() Map<String, String> refreshToken);

  @POST('/auth/logout')
  Future<void> logout();

  // User endpoints
  @GET('/users/me')
  Future<UserModel> getCurrentUser();

  @PUT('/users/me')
  Future<UserModel> updateProfile(@Body() Map<String, dynamic> profileData);

  @DELETE('/users/me')
  Future<Map<String, String>> deleteAccount();

  // Products endpoints
  @GET('/api/v1/products')
  Future<List<ProductModel>> searchProducts({
    @Query('search') String? query,
    @Query('category_id') String? category,
    @Query('min_price') double? minPrice,
    @Query('max_price') double? maxPrice,
    @Query('limit') int? limit,
  });

  @GET('/api/v1/products/{productId}')
  Future<ProductModel> getProduct(@Path('productId') String productId);

  @POST('/products/{productId}/click')
  Future<Map<String, dynamic>> trackProductClick(
    @Path('productId') String productId,
    @Body() Map<String, dynamic> clickData,
  );

  @GET('/api/v1/categories')
  Future<List<CategoryModel>> getCategories({
    @Query('active_only') bool? activeOnly,
    @Query('limit') int? limit,
  });

  @GET('/products/brands/')
  Future<List<BrandModel>> getBrands({
    @Query('limit') int? limit,
    @Query('offset') int? offset,
    @Query('featured_only') bool? featuredOnly,
  });

  @GET('/products/featured/')
  Future<List<ProductModel>> getFeaturedProducts({
    @Query('category') String? category,
    @Query('limit') int? limit,
  });

  @GET('/products/trending/')
  Future<List<ProductModel>> getTrendingProducts({
    @Query('category') String? category,
    @Query('limit') int? limit,
  });

  // Swipe endpoints
  @POST('/api/v1/swipe-sessions')
  Future<SwipeSessionModel> createSwipeSession(@Body() CreateSwipeSessionRequest request);

  @GET('/api/v1/swipe-sessions/{sessionId}')
  Future<SwipeSessionModel> getSwipeSession(@Path('sessionId') String sessionId);

  @POST('/api/v1/swipe-interactions')
  Future<SwipeInteractionModel> recordSwipeInteraction(
    @Body() RecordSwipeRequest request,
  );

  @GET('/api/v1/sessions/{sessionId}/interactions')
  Future<List<SwipeInteractionModel>> getSessionInteractions(
    @Path('sessionId') String sessionId,
    @Query('limit') int? limit,
  );

  @GET('/swipes/analytics/preferences')
  Future<SwipePreferencesModel> getUserPreferences();

  @GET('/swipes/analytics/patterns')
  Future<Map<String, dynamic>> getSwipePatterns();

  // Recommendations endpoints
  @GET('/api/v1/users/{userId}/recommendations')
  Future<List<RecommendationModel>> getRecommendations(
    @Path('userId') String userId,
    {
    @Query('limit') int? limit,
    @Query('session_id') String? sessionId,
  });

  @POST('/api/v1/recommendations')
  Future<RecommendationModel> createRecommendation(@Body() RecommendationCreateRequest request);

  @GET('/recommendations/analytics/performance')
  Future<RecommendationAnalyticsModel> getRecommendationAnalytics({
    @Query('days') int? days,
  });

  @DELETE('/recommendations/{recommendationId}')
  Future<Map<String, String>> dismissRecommendation(@Path('recommendationId') String recommendationId);

  // Gift Links endpoints
  @POST('/api/v1/gift-links')
  Future<Map<String, dynamic>> createGiftLink(@Body() Map<String, dynamic> linkData);

  @GET('/api/v1/gift-links/{linkToken}')
  Future<Map<String, dynamic>> accessGiftLink(@Path('linkToken') String linkToken);
}