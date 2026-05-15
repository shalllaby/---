
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  phone: 'phone',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  referralCode: 'referralCode',
  referralLink: 'referralLink',
  referredBy: 'referredBy',
  referralCount: 'referralCount',
  referralDiscountCode: 'referralDiscountCode',
  referralDiscountUsed: 'referralDiscountUsed',
  discountEligible: 'discountEligible',
  discountUsed: 'discountUsed'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  fullName: 'fullName',
  phone: 'phone',
  block: 'block',
  street: 'street',
  building: 'building',
  floor: 'floor',
  apartment: 'apartment',
  area: 'area',
  governorate: 'governorate',
  isDefault: 'isDefault',
  deliveryNotes: 'deliveryNotes',
  createdAt: 'createdAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  nameAr: 'nameAr',
  nameEn: 'nameEn',
  slug: 'slug',
  imageUrl: 'imageUrl',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  nameAr: 'nameAr',
  nameEn: 'nameEn',
  slug: 'slug'
};

exports.Prisma.ProductTagScalarFieldEnum = {
  productId: 'productId',
  tagId: 'tagId'
};

exports.Prisma.ProductAttributeScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  key: 'key',
  keyAr: 'keyAr',
  value: 'value',
  valueAr: 'valueAr'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  nameAr: 'nameAr',
  nameEn: 'nameEn',
  slug: 'slug',
  logoUrl: 'logoUrl'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  brandId: 'brandId',
  nameAr: 'nameAr',
  nameEn: 'nameEn',
  descriptionAr: 'descriptionAr',
  descriptionEn: 'descriptionEn',
  sku: 'sku',
  price: 'price',
  discountPrice: 'discountPrice',
  stockQuantity: 'stockQuantity',
  weightKg: 'weightKg',
  images: 'images',
  isActive: 'isActive',
  isFeatured: 'isFeatured',
  viewCount: 'viewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  addressId: 'addressId',
  status: 'status',
  paymentMethod: 'paymentMethod',
  paymentRef: 'paymentRef',
  shippingType: 'shippingType',
  trackingNumber: 'trackingNumber',
  shippingFee: 'shippingFee',
  codFee: 'codFee',
  subtotal: 'subtotal',
  couponCode: 'couponCode',
  discountAmount: 'discountAmount',
  totalAmount: 'totalAmount',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  quantity: 'quantity',
  priceAtPurchase: 'priceAtPurchase',
  productNameAr: 'productNameAr',
  productNameEn: 'productNameEn',
  productSku: 'productSku'
};

exports.Prisma.PackageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  nameAr: 'nameAr',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PackageItemScalarFieldEnum = {
  id: 'id',
  packageId: 'packageId',
  productId: 'productId',
  quantity: 'quantity',
  priceAtTime: 'priceAtTime',
  productNameArAtTime: 'productNameArAtTime',
  productNameEnAtTime: 'productNameEnAtTime'
};

exports.Prisma.ReferralScalarFieldEnum = {
  id: 'id',
  referrerId: 'referrerId',
  referredId: 'referredId',
  status: 'status',
  confirmedAt: 'confirmedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  rating: 'rating',
  body: 'body',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  code: 'code',
  discountPct: 'discountPct',
  isUsed: 'isUsed',
  usageLimit: 'usageLimit',
  usedCount: 'usedCount',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.LuckyWheelRewardScalarFieldEnum = {
  id: 'id',
  type: 'type',
  value: 'value',
  probability: 'probability',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LuckyWheelSpinScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  rewardId: 'rewardId',
  rewardType: 'rewardType',
  rewardValue: 'rewardValue',
  couponCode: 'couponCode',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
};

exports.KuwaitGovernorate = exports.$Enums.KuwaitGovernorate = {
  ASIMAH: 'ASIMAH',
  HAWALLI: 'HAWALLI',
  FARWANIYA: 'FARWANIYA',
  JAHRA: 'JAHRA',
  MUBARAK_AL_KABEER: 'MUBARAK_AL_KABEER',
  AHMADI: 'AHMADI'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
  REFUNDED: 'REFUNDED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  KNET: 'KNET',
  PAY_DEEMA: 'PAY_DEEMA',
  APPLE_PAY: 'APPLE_PAY',
  VISA_MASTERCARD: 'VISA_MASTERCARD',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY'
};

exports.ShippingType = exports.$Enums.ShippingType = {
  STANDARD: 'STANDARD',
  SAME_DAY: 'SAME_DAY',
  INSTANT: 'INSTANT',
  SELF_PICKUP: 'SELF_PICKUP'
};

exports.PackageType = exports.$Enums.PackageType = {
  HOME: 'HOME',
  WORK: 'WORK',
  CUSTOM: 'CUSTOM'
};

exports.PackageStatus = exports.$Enums.PackageStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED'
};

exports.ReferralStatus = exports.$Enums.ReferralStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Address: 'Address',
  Category: 'Category',
  Tag: 'Tag',
  ProductTag: 'ProductTag',
  ProductAttribute: 'ProductAttribute',
  Brand: 'Brand',
  Product: 'Product',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Package: 'Package',
  PackageItem: 'PackageItem',
  Referral: 'Referral',
  Review: 'Review',
  Coupon: 'Coupon',
  LuckyWheelReward: 'LuckyWheelReward',
  LuckyWheelSpin: 'LuckyWheelSpin'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
