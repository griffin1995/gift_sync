import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

import '../api/api_client.dart';
import '../api/dio_config.dart';
import '../models/product_model.dart';

class ProductRepository {
  final ApiClient _apiClient;

  ProductRepository(this._apiClient);

  // Product search and retrieval
  Future<List<ProductModel>> searchProducts({
    String? query,
    String? category,
    String? brand,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
    String? sortOrder,
    int? limit,
    int? offset,
  }) async {
    try {
      return await _apiClient.searchProducts(
        query: query,
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        limit: limit,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<ProductModel> getProduct(String productId) async {
    try {
      return await _apiClient.getProduct(productId);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<Map<String, dynamic>> trackProductClick(
    String productId,
    Map<String, dynamic> clickData,
  ) async {
    try {
      return await _apiClient.trackProductClick(productId, clickData);
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  // Categories and brands
  Future<List<CategoryModel>> getCategories({
    bool? activeOnly,
    int? limit,
  }) async {
    try {
      return await _apiClient.getCategories(
        activeOnly: activeOnly,
        limit: limit,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<List<BrandModel>> getBrands({
    int? limit,
    int? offset,
    bool? featuredOnly,
  }) async {
    try {
      return await _apiClient.getBrands(
        limit: limit,
        offset: offset,
        featuredOnly: featuredOnly,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  // Featured and trending products
  Future<List<ProductModel>> getFeaturedProducts({
    String? category,
    int? limit,
  }) async {
    try {
      return await _apiClient.getFeaturedProducts(
        category: category,
        limit: limit,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }

  Future<List<ProductModel>> getTrendingProducts({
    String? category,
    int? limit,
  }) async {
    try {
      return await _apiClient.getTrendingProducts(
        category: category,
        limit: limit,
      );
    } on DioException catch (e) {
      throw e.apiException;
    }
  }
}

// Provider for ProductRepository
final productRepositoryProvider = Provider<ProductRepository>((ref) {
  final dio = ref.read(dioProvider);
  final apiClient = ApiClient(dio);
  return ProductRepository(apiClient);
});

// Product search providers
final productSearchProvider = FutureProvider.family<List<ProductModel>, ProductSearchParams>((ref, params) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.searchProducts(
    query: params.query,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    limit: params.limit,
    offset: params.offset,
  );
});

final productProvider = FutureProvider.family<ProductModel, String>((ref, productId) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.getProduct(productId);
});

final categoriesProvider = FutureProvider.family<List<CategoryModel>, CategoryParams?>((ref, params) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.getCategories(
    activeOnly: params?.activeOnly,
    limit: params?.limit,
  );
});

final brandsProvider = FutureProvider.family<List<BrandModel>, BrandParams?>((ref, params) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.getBrands(
    limit: params?.limit,
    offset: params?.offset,
    featuredOnly: params?.featuredOnly,
  );
});

final featuredProductsProvider = FutureProvider.family<List<ProductModel>, FeaturedProductsParams?>((ref, params) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.getFeaturedProducts(
    category: params?.category,
    limit: params?.limit,
  );
});

final trendingProductsProvider = FutureProvider.family<List<ProductModel>, TrendingProductsParams?>((ref, params) async {
  final repository = ref.read(productRepositoryProvider);
  return repository.getTrendingProducts(
    category: params?.category,
    limit: params?.limit,
  );
});

// State management for product browsing
final productBrowserProvider = StateNotifierProvider<ProductBrowserNotifier, ProductBrowserState>((ref) {
  return ProductBrowserNotifier(ref);
});

// Supporting classes
class ProductSearchParams {
  final String? query;
  final String? category;
  final String? brand;
  final double? minPrice;
  final double? maxPrice;
  final String? sortBy;
  final String? sortOrder;
  final int? limit;
  final int? offset;

  ProductSearchParams({
    this.query,
    this.category,
    this.brand,
    this.minPrice,
    this.maxPrice,
    this.sortBy,
    this.sortOrder,
    this.limit,
    this.offset,
  });

  ProductSearchParams copyWith({
    String? query,
    String? category,
    String? brand,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
    String? sortOrder,
    int? limit,
    int? offset,
  }) {
    return ProductSearchParams(
      query: query ?? this.query,
      category: category ?? this.category,
      brand: brand ?? this.brand,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      limit: limit ?? this.limit,
      offset: offset ?? this.offset,
    );
  }
}

class CategoryParams {
  final bool? activeOnly;
  final int? limit;

  CategoryParams({this.activeOnly, this.limit});
}

class BrandParams {
  final int? limit;
  final int? offset;
  final bool? featuredOnly;

  BrandParams({this.limit, this.offset, this.featuredOnly});
}

class FeaturedProductsParams {
  final String? category;
  final int? limit;

  FeaturedProductsParams({this.category, this.limit});
}

class TrendingProductsParams {
  final String? category;
  final int? limit;

  TrendingProductsParams({this.category, this.limit});
}

class ProductBrowserState {
  final List<ProductModel> products;
  final List<CategoryModel> categories;
  final List<BrandModel> brands;
  final ProductSearchParams searchParams;
  final bool isLoading;
  final bool hasMore;
  final String? error;

  ProductBrowserState({
    this.products = const [],
    this.categories = const [],
    this.brands = const [],
    this.searchParams = const ProductSearchParams(),
    this.isLoading = false,
    this.hasMore = true,
    this.error,
  });

  ProductBrowserState copyWith({
    List<ProductModel>? products,
    List<CategoryModel>? categories,
    List<BrandModel>? brands,
    ProductSearchParams? searchParams,
    bool? isLoading,
    bool? hasMore,
    String? error,
  }) {
    return ProductBrowserState(
      products: products ?? this.products,
      categories: categories ?? this.categories,
      brands: brands ?? this.brands,
      searchParams: searchParams ?? this.searchParams,
      isLoading: isLoading ?? this.isLoading,
      hasMore: hasMore ?? this.hasMore,
      error: error ?? this.error,
    );
  }
}

class ProductBrowserNotifier extends StateNotifier<ProductBrowserState> {
  final Ref _ref;

  ProductBrowserNotifier(this._ref) : super(ProductBrowserState()) {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    state = state.copyWith(isLoading: true);
    
    try {
      final repository = _ref.read(productRepositoryProvider);
      
      // Load categories and brands in parallel
      final results = await Future.wait([
        repository.getCategories(activeOnly: true, limit: 20), // Active categories
        repository.getBrands(featuredOnly: true, limit: 20),
      ]);
      
      final categories = results[0] as List<CategoryModel>;
      final brands = results[1] as List<BrandModel>;
      
      state = state.copyWith(
        categories: categories,
        brands: brands,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> searchProducts(ProductSearchParams params) async {
    state = state.copyWith(
      isLoading: true,
      searchParams: params,
      error: null,
    );
    
    try {
      final repository = _ref.read(productRepositoryProvider);
      final products = await repository.searchProducts(
        query: params.query,
        category: params.category,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
      );
      
      state = state.copyWith(
        products: products,
        isLoading: false,
        hasMore: products.length >= (params.limit ?? 20),
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> loadMoreProducts() async {
    if (state.isLoading || !state.hasMore) return;
    
    final newParams = state.searchParams.copyWith(
      offset: state.products.length,
    );
    
    try {
      final repository = _ref.read(productRepositoryProvider);
      final moreProducts = await repository.searchProducts(
        query: newParams.query,
        category: newParams.category,
        brand: newParams.brand,
        minPrice: newParams.minPrice,
        maxPrice: newParams.maxPrice,
        sortBy: newParams.sortBy,
        sortOrder: newParams.sortOrder,
        limit: newParams.limit ?? 20,
        offset: newParams.offset ?? 0,
      );
      
      state = state.copyWith(
        products: [...state.products, ...moreProducts],
        hasMore: moreProducts.length >= (newParams.limit ?? 20),
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> trackProductClick(String productId) async {
    try {
      final repository = _ref.read(productRepositoryProvider);
      await repository.trackProductClick(productId, {
        'source': 'mobile_app',
        'timestamp': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      // Silently fail for analytics
    }
  }

  void clearSearch() {
    state = ProductBrowserState(
      categories: state.categories,
      brands: state.brands,
    );
  }
}