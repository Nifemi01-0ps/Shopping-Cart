// ShopFlow Product Data
//
// FakeStore API removed (HTTP 523 — site down permanently).
// All products now use your exact format with real Unsplash image URLs.
// Unsplash images load fine in <img> tags — the previous failure was
//
// Product sections:
//   1. YOUR PRODUCTS  — sneakers, wristwatches, oriamo, nivea (ids 1-21)
//   2. DUMMYJSON STATIC — embedded fallback (ids 2001-2030)
//   3. DUMMYJSON LIVE  — async fetch upgrades when server proxy is running
// ─────────────────────────────────────────────────────────────────────────────

const NGN_RATE = 1300;
const toNGN    = (usd) => Math.round(usd * NGN_RATE);

// ── FALLBACK IMAGES per collection ───────────────────────────────────────────
// Each entry: primary Unsplash URL + picsum fallback seed
// Used by ImageWithFallback when a product has no fallbackImg set
export const FALLBACK_IMAGES = {
  'sneakers':        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'wristwatches':    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'oriamo':          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'nivea':           'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  "men's fashion":   'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80',
  "women's fashion": 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'electronics':     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  'jewellery':       'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  'beauty & care':   'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
  'sports':          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  'home & living':   'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  'accessories':     'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  'default':         'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
};

// picsum fallback seeds — used by ImageWithFallback as the second fallback
// after Unsplash fails, before the inline SVG placeholder kicks in
export const PICSUM_FALLBACKS = {
  'sneakers':        'https://picsum.photos/seed/adidas-boost/600/600',
  'wristwatches':    'https://picsum.photos/seed/casio-gshock/600/600',
  'oriamo':          'https://picsum.photos/seed/headphones-over-ear/600/600',
  'nivea':           'https://picsum.photos/seed/mens-facewash/600/600',
  "men's fashion":   'https://picsum.photos/seed/mens-polo/600/600',
  "women's fashion": 'https://picsum.photos/seed/floral-dress/600/600',
  'electronics':     'https://picsum.photos/seed/macbook-pro/600/600',
  'jewellery':       'https://picsum.photos/seed/gold-necklace/600/600',
  'beauty & care':   'https://picsum.photos/seed/eyeshadow-palette/600/600',
  'sports':          'https://picsum.photos/seed/resistance-bands/600/600',
  'home & living':   'https://picsum.photos/seed/soy-candles/600/600',
  'accessories':     'https://picsum.photos/seed/sunglasses/600/600',
  'default':         'https://picsum.photos/seed/product-default/600/600',
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. YOUR PRODUCTS — exact format you provided, Unsplash images, NGN prices
// ─────────────────────────────────────────────────────────────────────────────

// ── img() / I() helpers — Unsplash primary, picsum fallback ─────────────────
//
// Every product image has TWO URLs:
//   • Primary   → images.unsplash.com  (real product photo, crisp quality)
//   • Fallback  → picsum.photos/seed   (stable CDN, loads even if Unsplash slow)
//
// ImageWithFallback tries primary → fallback → inline SVG placeholder.
// This means images ALWAYS display — no more blank boxes.
//
// I(unsplashPhotoId, picsumSeed) returns { img, fallbackImg, imgs }
// so you can spread it directly into a product object.
const I = (unsplashId, picsumSeed, extra = []) => {
  const src      = `https://images.unsplash.com/${unsplashId}?w=600&q=80`;
  const fallback = `https://picsum.photos/seed/${picsumSeed}/600/600`;
  return {
    img:        src,
    fallbackImg: fallback,
    imgs:       [src, ...extra],
  };
};

export const YOUR_PRODUCTS = [
  // SNEAKERS
  { id:1001,  name:"Nike Air Force 1 '07",    collection:'sneakers',    price:68000,  oldPrice:85000,  rating:4.8, reviews:312, badge:'sale', inStock:true,  isNew:false, sizes:['40','41','42','43','44','45'],    colors:['White','Black'],       img:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', fallbackImg:'https://picsum.photos/seed/nike-af1/600/600', imgs:['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], desc:"The classic AF1 silhouette with full-grain leather upper and Air-Sole unit for lightweight cushioning. A timeless street staple that goes with everything.", tags:['Nike','Leather','Street','Classic'] },
  { id:1002,  name:'Adidas Ultraboost 23',    collection:'sneakers',    price:95000,  oldPrice:null,   rating:4.9, reviews:208, badge:'hot',  inStock:true,  isNew:false, sizes:['40','41','42','43','44'],         colors:['Black','Grey'],        img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', fallbackImg:'https://picsum.photos/seed/adidas-boost/600/600',        imgs:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], desc:"Responsive Boost midsole with Primeknit upper. Built for performance runners who don't compromise on style.", tags:['Adidas','Running','Boost'] },
  { id:1003,  name:'Jordan 1 Retro High OG',  collection:'sneakers',    price:145000, oldPrice:160000, rating:4.7, reviews:509, badge:'sale', inStock:true,  isNew:false, sizes:['41','42','43','44','45'],         colors:['Red/Black','White/Black'], img:'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80', fallbackImg:'https://picsum.photos/seed/jordan1-high/600/600',   imgs:['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80'], desc:"The iconic Air Jordan 1 in premium leather. Heritage colourway that never goes out of style.", tags:['Jordan','Premium','Heritage'] },
  { id:1004,  name:'New Balance 574 Core',    collection:'sneakers',    price:52000,  oldPrice:null,   rating:4.6, reviews:187, badge:'new',  inStock:true,  isNew:true,  sizes:['39','40','41','42','43','44'],    colors:['Grey','Navy'],         img:'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80', fallbackImg:'https://picsum.photos/seed/newbalance-574/600/600',        imgs:['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80'], desc:'Classic NB lifestyle runner featuring ENCAP midsole technology for durability and support all day.', tags:['NewBalance','Lifestyle','Classic'] },
  { id:1005,  name:'Puma RS-X Efekt',         collection:'sneakers',    price:61000,  oldPrice:75000,  rating:4.5, reviews:143, badge:'sale', inStock:false, isNew:false, sizes:['40','41','42','43'],              colors:['White/Blue'],          img:'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', fallbackImg:'https://picsum.photos/seed/puma-rsx/600/600',        imgs:['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'], desc:'Bold chunky silhouette inspired by 80s running archives. RS cushioning for superior comfort.', tags:['Puma','Chunky','Bold'] },
  { id:1006,  name:'Vans Old Skool Pro',      collection:'sneakers',    price:38000,  oldPrice:null,   rating:4.4, reviews:276, badge:null,   inStock:true,  isNew:true,  sizes:['39','40','41','42','43','44','45'],colors:['Black/White','Navy'],  img:'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', fallbackImg:'https://picsum.photos/seed/vans-oldskool/600/600',        imgs:['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80'], desc:'Skate-ready suede and canvas upper with signature waffle outsole. Timeless, durable, affordable.', tags:['Vans','Skate','Canvas'] },

  // WRISTWATCHES
  { id:1007,  name:'Casio G-Shock GA-2100',   collection:'wristwatches', price:48000,  oldPrice:56000,  rating:4.8, reviews:421, badge:'sale', inStock:true,  isNew:false, sizes:['One Size'], colors:['Black','Olive'],          img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', fallbackImg:'https://picsum.photos/seed/casio-gshock/600/600',        imgs:['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'], desc:'Carbon Core Guard structure with analog-digital display. 200m water resistance — built to take anything.', tags:['Casio','Digital','Sport'] },
  { id:1008,  name:'Seiko Presage Cocktail',  collection:'wristwatches', price:185000, oldPrice:null,   rating:4.9, reviews:134, badge:'hot',  inStock:true,  isNew:false, sizes:['One Size'], colors:['Blue','White'],           img:'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80', fallbackImg:'https://picsum.photos/seed/seiko-presage/600/600',        imgs:['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'], desc:'Japanese automatic movement with stunning cocktail-inspired sunray dial. Dress watch with real character.', tags:['Seiko','Automatic','Dress'] },
  { id:1009,  name:'Fossil Minimalist Slim',  collection:'wristwatches', price:62000,  oldPrice:78000,  rating:4.5, reviews:298, badge:'sale', inStock:true,  isNew:false, sizes:['One Size'], colors:['Black','Brown'],          img:'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80', fallbackImg:'https://picsum.photos/seed/fossil-slim/600/600',        imgs:['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80'], desc:'Ultra-thin case with genuine leather strap. Quartz precision meets understated everyday style.', tags:['Fossil','Slim','Leather'] },
  { id:1010, name:'Timex Weekender 40mm',    collection:'wristwatches', price:32000,  oldPrice:null,   rating:4.3, reviews:512, badge:'new',  inStock:true,  isNew:true,  sizes:['One Size'], colors:['Tan','Navy'],            img:'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80', fallbackImg:'https://picsum.photos/seed/timex-weekender/600/600',        imgs:['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80'], desc:'Indiglo night light with swappable canvas strap. Affordable, reliable, endlessly versatile.', tags:['Timex','Canvas','Value'] },
  { id:1011, name:'Orient Bambino V2 Auto',  collection:'wristwatches', price:96000,  oldPrice:110000, rating:4.7, reviews:89,  badge:'sale', inStock:false, isNew:false, sizes:['One Size'], colors:['White','Black'],          img:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', fallbackImg:'https://picsum.photos/seed/orient-bambino/600/600',        imgs:['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80'], desc:'In-house automatic movement with dome crystal and domed dial. Classic dress piece at an honest price.', tags:['Orient','Automatic','Classic'] },

  // ORIAMO
  { id:1012, name:'Oriamo OEB-908 TWS Buds', collection:'oriamo',      price:18500,  oldPrice:24000,  rating:4.4, reviews:203, badge:'sale', inStock:true,  isNew:false, sizes:['One Size'], colors:['Black','White'],          img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', fallbackImg:'https://picsum.photos/seed/tws-earbuds/600/600',        imgs:['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'], desc:'True wireless stereo earbuds with 6-hour battery life, touch controls and IPX4 sweat resistance. Great everyday option.', tags:['Wireless','TWS','Earbuds'] },
  { id:1013, name:'Oriamo OHS-920 Headphones',collection:'oriamo',     price:14000,  oldPrice:null,   rating:4.2, reviews:318, badge:'new',  inStock:true,  isNew:true,  sizes:['One Size'], colors:['Black','Red'],           img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', fallbackImg:'https://picsum.photos/seed/headphones-over-ear/600/600',        imgs:['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'], desc:'Over-ear wired headphones with 40mm neodymium drivers and foldable design for easy storage.', tags:['Headphones','Wired','Bass'] },
  { id:1014, name:'Oriamo OBS-B14 Speaker',   collection:'oriamo',     price:22000,  oldPrice:28000,  rating:4.6, reviews:157, badge:'sale', inStock:true,  isNew:false, sizes:['One Size'], colors:['Black','Blue'],          img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', fallbackImg:'https://picsum.photos/seed/bt-speaker/600/600',        imgs:['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'], desc:'360-degree sound with 12-hour playtime and waterproof fabric shell. Party anywhere, anytime.', tags:['Speaker','Bluetooth','Portable'] },
  { id:1015, name:'Oriamo Power Bank 20000mAh',collection:'oriamo',    price:16500,  oldPrice:null,   rating:4.5, reviews:445, badge:null,   inStock:true,  isNew:false, sizes:['One Size'], colors:['Black','White'],          img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80', fallbackImg:'https://picsum.photos/seed/power-bank/600/600',        imgs:['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80'], desc:'Dual USB-A output with 20,000mAh capacity and LCD power indicator. Never run out of charge.', tags:['PowerBank','20000mAh','Dual'] },
  { id:1016, name:'Oriamo Neckband OEW-55',   collection:'oriamo',     price:9500,   oldPrice:13000,  rating:4.1, reviews:267, badge:'sale', inStock:false, isNew:false, sizes:['One Size'], colors:['Black'],                img:'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80', fallbackImg:'https://picsum.photos/seed/neckband-earphones/600/600',        imgs:['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80'], desc:'Neckband-style wireless earphones with magnetic switch and up to 8 hours of playback.', tags:['Neckband','Magnetic','Wireless'] },

  // NIVEA
  { id:1017, name:'Nivea Men Deep Black Carbon',   collection:'nivea', price:4200,   oldPrice:null,   rating:4.6, reviews:634, badge:'hot',  inStock:true,  isNew:false, sizes:['150ml'],          colors:['N/A'], img:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', fallbackImg:'https://picsum.photos/seed/mens-facewash/600/600',        imgs:['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'], desc:"Activated carbon face wash that deep cleans pores and removes excess oil. For the modern man's daily routine.", tags:['Men','Facewash','Carbon'] },
  { id:1018, name:'Nivea Body Lotion Cocoa Butter',collection:'nivea', price:3800,   oldPrice:4500,   rating:4.7, reviews:891, badge:'sale', inStock:true,  isNew:false, sizes:['200ml','400ml'],  colors:['N/A'], img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', fallbackImg:'https://picsum.photos/seed/body-lotion/600/600',        imgs:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'], desc:'24-hour moisture with natural cocoa butter and vitamin E. Deeply nourishes even dry skin.', tags:['Lotion','CocoButter','VitE'] },
  { id:1019, name:'Nivea Luminous630 Serum',       collection:'nivea', price:8900,   oldPrice:11000,  rating:4.8, reviews:423, badge:'sale', inStock:true,  isNew:false, sizes:['30ml'],           colors:['N/A'], img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', fallbackImg:'https://picsum.photos/seed/luminous-serum/600/600',        imgs:['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80'], desc:'Clinically proven to visibly reduce dark spots in 4 weeks. Patented Luminous630 technology.', tags:['Serum','Brightening','DarkSpots'] },
  { id:1020, name:'Nivea Micellar Water 3-in-1',   collection:'nivea', price:3200,   oldPrice:null,   rating:4.5, reviews:312, badge:'new',  inStock:true,  isNew:true,  sizes:['200ml','400ml'],  colors:['N/A'], img:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80', fallbackImg:'https://picsum.photos/seed/micellar-water/600/600',        imgs:['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80'], desc:'Cleanses, tones and removes makeup in one step. Gentle formula for all skin types with no rinsing needed.', tags:['Micellar','Cleanse','AllSkin'] },
  { id:1021, name:'Nivea Q10 Anti-Wrinkle Cream',  collection:'nivea', price:6700,   oldPrice:8000,   rating:4.7, reviews:256, badge:'sale', inStock:true,  isNew:false, sizes:['50ml'],           colors:['N/A'], img:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', fallbackImg:'https://picsum.photos/seed/mens-facewash/600/600',        imgs:['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'], desc:'Q10 coenzyme plus creatine formula firms skin and visibly reduces wrinkles in just 4 weeks.', tags:['Q10','AntiAge','Firming'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. DUMMYJSON STATIC FALLBACK — embedded so app works with zero network
// ─────────────────────────────────────────────────────────────────────────────
const DUMMYJSON_CAT_MAP = {
  'smartphones':      'electronics',
  'laptops':          'electronics',
  'tablets':          'electronics',
  'fragrances':       'beauty & care',
  'skincare':         'beauty & care',
  'beauty':           'beauty & care',
  'womens-dresses':   "women's fashion",
  'womens-tops':      "women's fashion",
  'womens-shoes':     "women's fashion",
  'mens-shirts':      "men's fashion",
  'mens-shoes':       "men's fashion",
  'mens-watches':     'wristwatches',
  'womens-watches':   'wristwatches',
  'womens-jewellery': 'jewellery',
  'home-decoration':  'home & living',
  'furniture':        'home & living',
  'sunglasses':       'accessories',
  'sports-accessories':'sports',
};

// DummyJSON static data — picsum images since dummyjson CDN may be blocked
// These get replaced with real dummyjson images when the proxy is available
const DUMMYJSON_STATIC = [
  { id:1022,  title:'iPhone 11',                    price:200,  disc:6.8, rating:4.69, stock:94,  cat:'smartphones',    img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', fallbackImg:'https://picsum.photos/seed/iphone-9/600/600' },
  { id:1023,  title:'iPhone 12',                    price:300,  disc:10, rating:4.44, stock:34,  cat:'smartphones',    img:'https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?w=600&q=80', fallbackImg:'https://picsum.photos/seed/iphone-x/600/600' },
  { id:1024,  title:'Samsung Galaxy S23',          price:500,  disc:6, rating:4.09, stock:36,  cat:'smartphones',    img:'https://images.unsplash.com/photo-1709744722656-9b850470293f?w=600&q=80', fallbackImg:'https://picsum.photos/seed/samsung-s23/600/600' },
  { id:1025,  title:'OPPO F19',                    price:110,  disc: 5, rating:4.30, stock:123, cat:'smartphones',    img:'https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=600&q=80', fallbackImg:'https://picsum.photos/seed/oppo-f19/600/600' },
  { id:1026,  title:'MacBook Pro 2021',            price:1000, disc:11.02, rating:4.57, stock:83,  cat:'laptops',        img:'https://images.unsplash.com/photo-1636565446910-ae75200f5b07?w=600&q=80', fallbackImg:'https://picsum.photos/seed/macbook-pro/600/600' },
  { id:1027,  title:'Samsung Galaxy Book',         price:800, disc:10, rating:4.25, stock:50,  cat:'laptops',        img:'https://images.unsplash.com/photo-1661595676335-aa93ecbf4b42?w=600&q=80', fallbackImg:'https://picsum.photos/seed/samsung-laptop/600/600' },
  { id:1028,  title:'Microsoft Surface Laptop 4',  price:150, disc:4, rating:4.43, stock:68,  cat:'laptops',        img:'https://images.unsplash.com/photo-1617780421749-ebd0ef657b2e?w=600&q=80', fallbackImg:'https://picsum.photos/seed/surface-laptop/600/600' },
  { id:1029,  title:'HP Pavilion Gaming Laptop',   price:800, disc:6.18,  rating:4.43, stock:89,  cat:'laptops',        img:'https://images.unsplash.com/photo-1663354027456-ce6a7e07d212?w=600&q=80', fallbackImg:'https://picsum.photos/seed/hp-gaming/600/600' },
  { id:1030,  title:'Dior J\'adore Perfume',       price:89,   disc:8.40,  rating:4.26, stock:65,  cat:'fragrances',     img:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', fallbackImg:'https://picsum.photos/seed/dior-jadore/600/600' },
  { id:1031, title:'Royal Mirage Sport Brown',    price:40,   disc:15.66, rating:4.00, stock:52,  cat:'fragrances',     img:'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', fallbackImg:'https://picsum.photos/seed/royal-mirage/600/600' },
  { id:1032, title:'Eyeshadow Palette',           price:19,   disc:13.60, rating:3.79, stock:84,  cat:'beauty',         img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80', fallbackImg:'https://picsum.photos/seed/eyeshadow-palette/600/600' },
  { id:1033, title:'Red Lipstick',                price:12,   disc:19.03, rating:4.23, stock:68,  cat:'beauty',         img:'https://images.unsplash.com/photo-1586495777744-4e6232bec854?w=600&q=80', fallbackImg:'https://picsum.photos/seed/red-lipstick/600/600' },
  { id:1034, title:'Mascara',                     price:13,   disc:17.00, rating:4.28, stock:58,  cat:'beauty',         img:'https://images.unsplash.com/photo-1631214524020-3c69bfa9e4e1?w=600&q=80', fallbackImg:'https://picsum.photos/seed/mascara/600/600' },
  { id:1035, title:'Skin Rescue Moisturiser',     price:40,   disc:19.00, rating:4.56, stock:54,  cat:'skincare',       img:'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', fallbackImg:'https://picsum.photos/seed/skin-moisturiser/600/600' },
  { id:1036, title:'Facial Gentle Cleanser',      price:20,   disc:10.00, rating:4.36, stock:56,  cat:'skincare',       img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', fallbackImg:'https://picsum.photos/seed/luminous-serum/600/600' },
  { id:1037, title:'Women\'s Floral Summer Dress',price:55,   disc:18.00, rating:4.45, stock:90,  cat:'womens-dresses', img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', fallbackImg:'https://picsum.photos/seed/floral-dress/600/600' },
  { id:1038, title:'Women\'s Long Knit Dress',    price:70,   disc:19.08, rating:4.23, stock:79,  cat:'womens-dresses', img:'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', fallbackImg:'https://picsum.photos/seed/knit-dress/600/600' },
  { id:1039, title:'Women\'s Knit Sweater',       price:18,   disc:16.07, rating:4.16, stock:65,  cat:'womens-tops',    img:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', fallbackImg:'https://picsum.photos/seed/knit-sweater/600/600' },
  { id:1040, title:'Women\'s Running Shoes',      price:89,   disc:12.00, rating:4.38, stock:45,  cat:'womens-shoes',   img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', fallbackImg:'https://picsum.photos/seed/adidas-boost/600/600' },
  { id:1041, title:'Men\'s Classic Polo Shirt',   price:31,   disc:10.00, rating:4.07, stock:125, cat:'mens-shirts',    img:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80', fallbackImg:'https://picsum.photos/seed/mens-polo/600/600' },
  { id:1042, title:'Men\'s Slim Fit Chinos',      price:45,   disc:8.00,  rating:4.22, stock:88,  cat:'mens-shirts',    img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80', fallbackImg:'https://picsum.photos/seed/mens-chinos/600/600' },
  { id:1043, title:'Men\'s Casual Sneakers',      price:79,   disc:14.00, rating:4.35, stock:60,  cat:'mens-shoes',     img:'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80', fallbackImg:'https://picsum.photos/seed/casual-sneakers/600/600' },
  { id:1044, title:'Men\'s Automatic Watch',      price:199,  disc:12.00, rating:4.55, stock:40,  cat:'mens-watches',   img:'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80', fallbackImg:'https://picsum.photos/seed/automatic-watch/600/600' },
  { id:1045, title:'Women\'s Rose Gold Watch',    price:159,  disc:9.00,  rating:4.41, stock:55,  cat:'womens-watches', img:'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=80', fallbackImg:'https://picsum.photos/seed/rosegold-watch/600/600' },
  { id:1046, title:'Diamond Stud Earrings',       price:120,  disc:15.00, rating:4.62, stock:30,  cat:'womens-jewellery',img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', fallbackImg:'https://picsum.photos/seed/diamond-earrings/600/600' },
  { id:1047, title:'Gold Chain Necklace',         price:85,   disc:11.00, rating:4.18, stock:47,  cat:'womens-jewellery',img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80', fallbackImg:'https://picsum.photos/seed/gold-necklace/600/600' },
  { id:1048, title:'Boho Macrame Plant Hanger',   price:41,   disc:17.00, rating:4.08, stock:131, cat:'home-decoration', img:'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&q=80', fallbackImg:'https://picsum.photos/seed/plant-hanger/600/600' },
  { id:1049, title:'Scented Soy Candles Set',     price:29,   disc:10.00, rating:4.34, stock:95,  cat:'home-decoration', img:'https://images.unsplash.com/photo-1602874801007-bd458bb1a698?w=600&q=80', fallbackImg:'https://picsum.photos/seed/soy-candles/600/600' },
  { id:1050, title:'Resistance Bands Set',        price:25,   disc:8.00,  rating:4.27, stock:200, cat:'sports-accessories',img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', fallbackImg:'https://picsum.photos/seed/body-lotion/600/600' },
  { id:1051, title:'Polarised Sunglasses',        price:49,   disc:13.00, rating:4.15, stock:73,  cat:'sunglasses',     img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', fallbackImg:'https://picsum.photos/seed/sunglasses/600/600' },
];

function mapDummyStatic(p) {
  const collection = DUMMYJSON_CAT_MAP[p.cat] || p.cat || 'other';
  const priceNGN   = toNGN(p.price);
  const hasDisc    = p.disc > 5;
  const oldPrice   = hasDisc ? Math.round(priceNGN / (1 - p.disc / 100)) : null;
  const badge      = p.rating >= 4.5 ? 'hot' : hasDisc && p.disc >= 15 ? 'sale' : p.id % 7 === 0 ? 'new' : null;
  const img        = p.img || FALLBACK_IMAGES[collection] || FALLBACK_IMAGES.default;
  return {
    id:         2000 + p.id,
    name:       p.title,
    collection,
    price:      priceNGN,
    oldPrice,
    rating:     Math.round(p.rating * 10) / 10,
    reviews:    50 + (p.id * 23) % 450,
    badge,
    inStock:    p.stock > 0,
    isNew:      badge === 'new',
    img,
    imgs:       [img],
    fallbackImg: FALLBACK_IMAGES[collection] || FALLBACK_IMAGES.default,
    desc:       `${p.title} — quality guaranteed with fast delivery across Nigeria.`,
    tags:       [collection, p.cat].filter(Boolean),
    sizes:      ['One Size'],
    colors:     ['Default'],
    category:   p.cat,
    currency:   'NGN',
  };
}

const DUMMYJSON_STATIC_MAPPED = DUMMYJSON_STATIC.map(mapDummyStatic);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ASYNC DUMMYJSON FETCH — upgrades static data with live products + real images
// ─────────────────────────────────────────────────────────────────────────────
const isLocalhost = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

async function fetchWithTimeout(url, ms = 8000) {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function mapDummyLive(p) {
  const collection = DUMMYJSON_CAT_MAP[p.category] || p.category || 'other';
  const priceNGN   = toNGN(p.price);
  const disc       = p.discountPercentage || 0;
  const oldPrice   = disc > 5 ? Math.round(priceNGN / (1 - disc / 100)) : null;
  const rating     = Math.round((p.rating || 4.0) * 10) / 10;
  const badge      = rating >= 4.5 ? 'hot' : disc >= 10 ? 'sale' : null;
  const img        = p.thumbnail || p.images?.[0] || FALLBACK_IMAGES[collection] || FALLBACK_IMAGES.default;
  return {
    id:         2000 + p.id,
    name:       p.title,
    collection,
    price:      priceNGN,
    oldPrice,
    rating,
    reviews:    p.reviews?.length ?? (50 + (p.id * 23) % 450),
    badge,
    inStock:    (p.stock ?? 1) > 0,
    isNew:      badge === null && p.id % 7 === 0,
    img,
    imgs:       Array.isArray(p.images) && p.images.length ? p.images : [img],
    fallbackImg: FALLBACK_IMAGES[collection] || FALLBACK_IMAGES.default,
    desc:       p.description || `${p.title} — quality guaranteed.`,
    tags:       Array.isArray(p.tags) ? p.tags : [collection],
    sizes:      ['One Size'],
    colors:     ['Default'],
    category:   p.category,
    currency:   'NGN',
  };
}

let _dummyCache = null;

export async function fetchDummyProducts() {
  if (_dummyCache) return _dummyCache;

  const SOURCES = [
    { label: 'DummyJSON direct', url: 'https://dummyjson.com/products?limit=30&skip=0' },
    { label: 'DummyJSON proxy',  url: '/api/dummyjson/products?limit=30&skip=0' },
  ];

  for (const { label, url } of SOURCES) {
    try {
      console.log(`[ShopFlow] Trying ${label}...`);
      const data = await fetchWithTimeout(url);
      if (data?.products?.length) {
        const live     = data.products.map(mapDummyLive);
        const yourIds  = new Set(YOUR_PRODUCTS.map(p => p.id));
        const liveIds  = new Set(live.map(p => p.id));

        // Live products that don't clash with YOUR_PRODUCTS
        const liveOnly = live.filter(p => !yourIds.has(p.id));

        // Static fallback products NOT already returned by the live fetch
        // This ensures all 51 static products always show, even when live data loads
        const staticOnly = DUMMYJSON_STATIC_MAPPED.filter(
          p => !liveIds.has(p.id) && !yourIds.has(p.id)
        );

        _dummyCache = [...YOUR_PRODUCTS, ...liveOnly, ...staticOnly];
        console.log(
          `[ShopFlow] ${label}: ${YOUR_PRODUCTS.length} local + ${liveOnly.length} live + ${staticOnly.length} static = ${_dummyCache.length} total`
        );
        return _dummyCache;
      }
    } catch (err) {
      console.warn(`[ShopFlow] ${label} failed (${err.message})`);
    }
  }

  // All sources failed — static data keeps the app fully working
  console.warn('[ShopFlow] All live sources failed — using static fallback');
  _dummyCache = products; // YOUR_PRODUCTS + DUMMYJSON_STATIC_MAPPED
  return _dummyCache;
}

// FakeStore removed — was returning HTTP 523 (site down)
export async function fetchFakestoreProducts() {
  return []; // no-op — keeps useProducts.js import working without breaking
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATIC PRODUCT LIST — always available, zero network dependency
//    Order: your products first, then dummyjson static
// ─────────────────────────────────────────────────────────────────────────────
export const products = [...YOUR_PRODUCTS, ...DUMMYJSON_STATIC_MAPPED];

// Keep CUSTOM_PRODUCTS as alias for backward compat with tests
export const CUSTOM_PRODUCTS = YOUR_PRODUCTS;

// ─────────────────────────────────────────────────────────────────────────────
// 5. COLLECTIONS — cover image = first product in that collection
// ─────────────────────────────────────────────────────────────────────────────
function getCollectionImg(collId) {
  const first = products.find(p => p.collection === collId);
  return first?.img || FALLBACK_IMAGES[collId] || FALLBACK_IMAGES.default;
}

export const collections = [
  { id:'all',              label:'All',             emoji:'🛍️', desc:'Browse everything we carry',          img: FALLBACK_IMAGES.default },
  { id:'sneakers',         label:'Sneakers',        emoji:'👟', desc:'Fresh kicks for every occasion',      img: getCollectionImg('sneakers') },
  { id:'wristwatches',     label:'Wristwatches',    emoji:'⌚', desc:'Timepieces that make a statement',    img: getCollectionImg('wristwatches') },
  { id:'oriamo',           label:'Oriamo',          emoji:'🎧', desc:'Audio & tech accessories',            img: getCollectionImg('oriamo') },
  { id:'nivea',            label:'Nivea',           emoji:'✨', desc:'Skincare you can trust',              img: getCollectionImg('nivea') },
  { id:"men's fashion",    label:"Men's Fashion",   emoji:'👔', desc:'Clothing & accessories for men',      img: getCollectionImg("men's fashion") },
  { id:"women's fashion",  label:"Women's Fashion", emoji:'👗', desc:'Clothing & accessories for women',    img: getCollectionImg("women's fashion") },
  { id:'electronics',      label:'Electronics',     emoji:'💻', desc:'Phones, laptops & tech',              img: getCollectionImg('electronics') },
  { id:'jewellery',        label:'Jewellery',       emoji:'💍', desc:'Rings, bracelets & more',             img: getCollectionImg('jewellery') },
  { id:'beauty & care',    label:'Beauty & Care',   emoji:'💄', desc:'Fragrances, skincare & cosmetics',    img: getCollectionImg('beauty & care') },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
export const reviews = {
  1:  [{ user:'Emeka O.', rating:5, date:'Feb 2025', text:'Fits perfectly. Fast delivery too!' }, { user:'Bolu F.', rating:5, date:'Jan 2025', text:'Leather quality is top notch.' }],
  7:  [{ user:'Kunle M.', rating:5, date:'Jan 2025', text:'G-Shock never disappoints. This thing is indestructible.' }],
  8:  [{ user:'Chuka A.', rating:5, date:'Mar 2025', text:'Beautiful watch, arrived well packaged. Exactly as shown.' }],
  12: [{ user:'Sola T.',  rating:4, date:'Jan 2025', text:'Good sound quality for the price. Battery lasts all day.' }],
  17: [{ user:'Timi B.',  rating:4, date:'Feb 2025', text:'Works great for oily skin. Noticed a difference in a week.' }],
  19: [{ user:'Ada N.',   rating:5, date:'Jan 2025', text:'Noticed a visible difference in my dark spots in 3 weeks!' }],
  21: [{ user:'Ngozi K.', rating:5, date:'Mar 2025', text:'Skin feels firmer after 4 weeks. Will buy again.' }],
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. COUPONS
// ─────────────────────────────────────────────────────────────────────────────
export const coupons = { SAVE10: 10, WELCOME20: 20, FLASH15: 15 };