import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

@JsonSerializable()
class ProductModel {
  final String id;
  final String title;
  final String? description;
  final String? brand;
  @JsonKey(name: 'price_min')
  final double? priceMin;
  @JsonKey(name: 'price_max')
  final double? priceMax;
  final String currency;
  @JsonKey(name: 'category_id')
  final String? categoryId;
  final List<String> tags;
  final Map<String, dynamic>? features;
  @JsonKey(name: 'image_url')
  final String? imageUrl;
  @JsonKey(name: 'affiliate_url')
  final String? affiliateUrl;
  @JsonKey(name: 'affiliate_network')
  final String? affiliateNetwork;
  @JsonKey(name: 'commission_rate')
  final double? commissionRate;
  final double? rating;
  @JsonKey(name: 'review_count')
  final int reviewCount;
  @JsonKey(name: 'availability_status')
  final String availabilityStatus;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(name: 'created_at')
  final String? createdAt;
  @JsonKey(name: 'updated_at')
  final String? updatedAt;

  ProductModel({
    required this.id,
    required this.title,
    this.description,
    this.brand,
    this.priceMin,
    this.priceMax,
    required this.currency,
    this.categoryId,
    this.tags = const [],
    this.features,
    this.imageUrl,
    this.affiliateUrl,
    this.affiliateNetwork,
    this.commissionRate,
    this.rating,
    required this.reviewCount,
    required this.availabilityStatus,
    required this.isActive,
    this.createdAt,
    this.updatedAt,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => _$ProductModelFromJson(json);
  Map<String, dynamic> toJson() => _$ProductModelToJson(this);

  // Helper getters
  String get displayPrice {
    if (priceMin != null && priceMax != null && priceMin != priceMax) {
      return '\$${priceMin!.toStringAsFixed(2)} - \$${priceMax!.toStringAsFixed(2)}';
    } else if (priceMin != null) {
      return '\$${priceMin!.toStringAsFixed(2)}';
    } else if (priceMax != null) {
      return '\$${priceMax!.toStringAsFixed(2)}';
    }
    return 'Price not available';
  }
  
  String get mainImageUrl => imageUrl ?? '';
  
  String get primaryCategory => categoryId ?? 'General';
  
  double? get averageRating => rating;
}

@JsonSerializable()
class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String? description;
  @JsonKey(name: 'parent_id')
  final String? parentId;
  @JsonKey(name: 'sort_order')
  final int sortOrder;
  @JsonKey(name: 'icon_url')
  final String? iconUrl;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(name: 'created_at')
  final String? createdAt;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.parentId,
    required this.sortOrder,
    this.iconUrl,
    required this.isActive,
    this.createdAt,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) => _$CategoryModelFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryModelToJson(this);
}

@JsonSerializable()
class BrandModel {
  final String id;
  final String name;
  final String slug;
  final String? description;
  @JsonKey(name: 'logo_url')
  final String? logoUrl;
  @JsonKey(name: 'website_url')
  final String? websiteUrl;
  @JsonKey(name: 'product_count')
  final int productCount;
  @JsonKey(name: 'popularity_score')
  final double? popularityScore;
  @JsonKey(name: 'is_featured')
  final bool isFeatured;

  BrandModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.logoUrl,
    this.websiteUrl,
    required this.productCount,
    this.popularityScore,
    required this.isFeatured,
  });

  factory BrandModel.fromJson(Map<String, dynamic> json) => _$BrandModelFromJson(json);
  Map<String, dynamic> toJson() => _$BrandModelToJson(this);
}