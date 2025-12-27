import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// Categories
// =============================================================================

const categories = [
    { name: 'Nature', nameVi: 'Thiên nhiên' },
    { name: 'Lake', nameVi: 'Hồ' },
    { name: 'Café', nameVi: 'Quán cà phê' },
    { name: 'Waterfall', nameVi: 'Thác nước' },
    { name: 'Street', nameVi: 'Đường phố' },
    { name: 'Architecture', nameVi: 'Kiến trúc' },
    { name: 'Historic Stay', nameVi: 'Lưu trú lịch sử' },
    { name: 'Adventure', nameVi: 'Phiêu lưu' },
    { name: 'Park', nameVi: 'Công viên' },
    { name: 'Local Experience', nameVi: 'Trải nghiệm địa phương' },
    { name: 'Scenic', nameVi: 'Phong cảnh' }
];

// =============================================================================
// Places
// =============================================================================

const places = [
    {
        title: 'Langbiang Mountain',
        titleVi: 'Núi Langbiang',
        location: 'Lạc Dương District',
        locationVi: 'Huyện Lạc Dương',
        description: 'A mystical peak wrapped in morning mist, offering panoramic views of the highlands. The mountain stands at 2,167m and is sacred to the K\'ho people.',
        descriptionVi: 'Một đỉnh núi huyền bí bao phủ trong sương mù buổi sáng, mang đến tầm nhìn toàn cảnh vùng cao nguyên.',
        imagePath: '/images/langbiang-mountain.jpg',
        categoryName: 'Nature',
        latitude: 12.0459,
        longitude: 108.4412,
        openingHours: '6:00 AM - 5:00 PM',
        designerTip: 'Start your hike at dawn to catch the mesmerizing sea of clouds. Bring layers as temperatures drop significantly at the peak.'
    },
    {
        title: 'Hồ Tuyền Lâm',
        titleVi: 'Hồ Tuyền Lâm',
        location: 'Trại Mát Ward',
        locationVi: 'Phường Trại Mát',
        description: 'A serene lake surrounded by pine forests, perfect for contemplative mornings. The largest lake in Da Lat with stunning natural scenery.',
        descriptionVi: 'Hồ yên bình bao quanh bởi rừng thông, hoàn hảo cho những buổi sáng chiêm nghiệm.',
        imagePath: '/images/tuyen-lam-lake.jpg',
        categoryName: 'Lake',
        latitude: 11.9165,
        longitude: 108.4231,
        designerTip: 'Rent a kayak in the early afternoon when the light is softest. The small islands in the middle of the lake offer secluded spots for a peaceful picnic.'
    },
    {
        title: 'The Married Café',
        titleVi: 'Quán Cà Phê Vợ Chồng',
        location: 'Phường 4, Dalat',
        locationVi: 'Phường 4, Đà Lạt',
        description: 'Where artisanal coffee meets French colonial architecture in a garden setting. A hidden gem known for its unique atmosphere.',
        descriptionVi: 'Nơi cà phê thủ công gặp gỡ kiến trúc thuộc địa Pháp trong khung cảnh vườn.',
        imagePath: '/images/married-cafe.jpg',
        categoryName: 'Café',
        latitude: 11.9416,
        longitude: 108.4378,
        openingHours: '7:00 AM - 10:00 PM',
        designerTip: 'Ask for the house special weasel coffee. Sit in the garden area during late afternoon for the best lighting.'
    },
    {
        title: 'Valley of Love',
        titleVi: 'Thung Lũng Tình Yêu',
        location: 'Phường 8, Dalat',
        locationVi: 'Phường 8, Đà Lạt',
        description: 'Rolling hills adorned with wildflowers, a timeless romantic escape. One of the most famous tourist attractions in Da Lat.',
        descriptionVi: 'Những ngọn đồi thoai thoải điểm xuyết hoa dại, nơi trốn thoát lãng mạn vượt thời gian.',
        imagePath: '/images/valley-of-love.jpg',
        categoryName: 'Park',
        latitude: 11.9521,
        longitude: 108.4289,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Visit early morning to avoid crowds. The lake at the heart of the valley is especially beautiful with morning mist.'
    },
    {
        title: 'Datanla Waterfall',
        titleVi: 'Thác Datanla',
        location: 'Prenn Pass',
        locationVi: 'Đèo Prenn',
        description: 'Crystal waters cascading through ancient forest, an adventure in nature. Features an exciting alpine coaster ride.',
        descriptionVi: 'Dòng nước trong vắt đổ xuống giữa rừng cổ thụ, một cuộc phiêu lưu giữa thiên nhiên.',
        imagePath: '/images/datanla-waterfall.jpg',
        categoryName: 'Waterfall',
        latitude: 11.9089,
        longitude: 108.4567,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Take the alpine coaster for an unforgettable experience. Visit during or right after the rainy season for the most impressive water flow.'
    },
    {
        title: 'Mai Anh Đào Street',
        titleVi: 'Đường Mai Anh Đào',
        location: 'Phường 3, Dalat',
        locationVi: 'Phường 3, Đà Lạt',
        description: 'Cherry blossom lanes that transform into a pink dreamscape each spring. A photographer\'s paradise during blooming season.',
        descriptionVi: 'Những con đường hoa anh đào biến thành khung cảnh mơ màng màu hồng mỗi mùa xuân.',
        imagePath: '/images/mai-anh-dao-street.jpg',
        categoryName: 'Street',
        latitude: 11.9398,
        longitude: 108.4356,
        designerTip: 'Best visited in late January to early February during cherry blossom season. Early morning offers the best photographs without crowds.'
    },
    {
        title: 'Dalat Palace Heritage Hotel',
        titleVi: 'Khách Sạn Dalat Palace',
        location: 'Trần Phú Street',
        locationVi: 'Đường Trần Phú',
        description: 'Perfect for misty weather - cozy French colonial architecture. A historic luxury hotel dating back to 1922.',
        descriptionVi: 'Hoàn hảo cho thời tiết sương mù - kiến trúc thuộc địa Pháp ấm cúng.',
        imagePath: '/images/dalat-palace.jpg',
        categoryName: 'Historic Stay',
        latitude: 11.9363,
        longitude: 108.4383,
        phone: '+84 263 3825 444'
    },
    {
        title: 'Me Linh Coffee Garden',
        titleVi: 'Vườn Cà Phê Mê Linh',
        location: 'Tà Nung',
        locationVi: 'Tà Nung',
        description: 'Valley views enhanced by morning fog. One of the most scenic coffee gardens in Da Lat with panoramic mountain views.',
        descriptionVi: 'Tầm nhìn thung lũng được tôn thêm bởi sương mù buổi sáng.',
        imagePath: '/images/me-linh-coffee.jpg',
        categoryName: 'Café',
        latitude: 11.8833,
        longitude: 108.4756,
        openingHours: '6:00 AM - 6:00 PM'
    },
    {
        title: 'Xuan Huong Lake',
        titleVi: 'Hồ Xuân Hương',
        location: 'City Center',
        locationVi: 'Trung tâm thành phố',
        description: 'Misty mornings create magical reflections. The heart of Da Lat city, perfect for romantic walks and cycling.',
        descriptionVi: 'Những buổi sáng sương mù tạo nên những phản chiếu kỳ diệu.',
        imagePath: '/images/xuan-huong-lake.jpg',
        categoryName: 'Scenic',
        latitude: 11.9380,
        longitude: 108.4372
    },
    {
        title: 'Crazy House',
        titleVi: 'Ngôi Nhà Điên',
        location: 'Huỳnh Thúc Kháng Street',
        locationVi: 'Đường Huỳnh Thúc Kháng',
        description: 'Indoor exploration ideal for any weather. A unique architectural masterpiece designed by architect Đặng Việt Nga.',
        descriptionVi: 'Khám phá trong nhà lý tưởng cho mọi thời tiết.',
        imagePath: '/images/crazy-house.jpg',
        categoryName: 'Architecture',
        latitude: 11.9345,
        longitude: 108.4252,
        openingHours: '8:30 AM - 7:00 PM'
    },
    {
        title: 'Dalat Night Market',
        titleVi: 'Chợ Đêm Đà Lạt',
        location: 'Nguyen Thi Minh Khai Street',
        locationVi: 'Đường Nguyễn Thị Minh Khai',
        description: 'Cool evening weather perfect for street food. Experience local cuisine and culture in this vibrant night market.',
        descriptionVi: 'Thời tiết buổi tối mát mẻ hoàn hảo cho ẩm thực đường phố.',
        imagePath: '/images/dalat-night-market.jpg',
        categoryName: 'Local Experience',
        latitude: 11.9431,
        longitude: 108.4398,
        openingHours: '6:00 PM - 11:00 PM'
    },
    {
        title: 'Langbiang Peak Trail',
        titleVi: 'Đường Mòn Đỉnh Langbiang',
        location: 'Lạc Dương District',
        locationVi: 'Huyện Lạc Dương',
        description: 'Clear skies ideal for panoramic views. A challenging but rewarding hiking trail to the summit.',
        descriptionVi: 'Bầu trời trong xanh lý tưởng cho tầm nhìn toàn cảnh.',
        imagePath: '/images/langbiang-trail.jpg',
        categoryName: 'Adventure',
        latitude: 12.0500,
        longitude: 108.4400
    }
];

// =============================================================================
// Sample Reviews
// =============================================================================

const sampleReviews = [
    {
        title: 'Amazing mountain experience!',
        content: 'The view from Langbiang Mountain is absolutely breathtaking. I recommend going early in the morning to catch the sunrise.',
        rating: 5,
        language: 'en',
        placeTitle: 'Langbiang Mountain'
    },
    {
        title: 'Peaceful lake escape',
        content: 'Tuyen Lam Lake is so serene. We rented kayaks and spent the whole afternoon exploring. Highly recommend!',
        rating: 5,
        language: 'en',
        placeTitle: 'Hồ Tuyền Lâm'
    },
    {
        title: 'Best coffee in Dalat',
        content: 'The weasel coffee here is incredible. The garden atmosphere is unique and relaxing.',
        rating: 4,
        language: 'en',
        placeTitle: 'The Married Café'
    },
    {
        title: 'Thác nước tuyệt đẹp',
        content: 'Datanla thật sự đẹp! Trượt xe xuống thác rất thú vị. Nhớ mang áo mưa!',
        rating: 5,
        language: 'vi',
        placeTitle: 'Datanla Waterfall'
    },
    {
        title: 'Chợ đêm vui quá',
        content: 'Đồ ăn ngon, giá cả phải chăng. Nên đến vào ngày thường để tránh đông.',
        rating: 4,
        language: 'vi',
        placeTitle: 'Dalat Night Market'
    }
];

// =============================================================================
// Seed Function
// =============================================================================

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.place.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✓ Cleared existing data');

    // Create categories
    for (const cat of categories) {
        await prisma.category.create({ data: cat });
    }
    console.log(`✓ Created ${categories.length} categories`);

    // Get category map
    const categoryMap = {};
    const allCategories = await prisma.category.findMany();
    for (const cat of allCategories) {
        categoryMap[cat.name] = cat.id;
    }

    // Create places
    for (const place of places) {
        const { categoryName, ...placeData } = place;
        await prisma.place.create({
            data: {
                ...placeData,
                categoryId: categoryMap[categoryName]
            }
        });
    }
    console.log(`✓ Created ${places.length} places`);

    // Create demo user
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@dalat.vibe',
            username: 'Traveler',
            passwordHash: await bcrypt.hash('password123', 10),
            avatar: 'https://i.pravatar.cc/150?img=33'
        }
    });
    console.log('✓ Created demo user');

    // Get place map
    const placeMap = {};
    const allPlaces = await prisma.place.findMany();
    for (const p of allPlaces) {
        placeMap[p.title] = p.id;
    }

    // Create sample reviews
    for (const review of sampleReviews) {
        const { placeTitle, ...reviewData } = review;
        if (placeMap[placeTitle]) {
            await prisma.review.create({
                data: {
                    ...reviewData,
                    tags: '[]',
                    userId: demoUser.id,
                    placeId: placeMap[placeTitle]
                }
            });
        }
    }
    console.log(`✓ Created ${sampleReviews.length} sample reviews`);

    // Update place ratings
    for (const place of allPlaces) {
        const reviews = await prisma.review.findMany({
            where: { placeId: place.id }
        });
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await prisma.place.update({
                where: { id: place.id },
                data: {
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: reviews.length
                }
            });
        }
    }
    console.log('✓ Updated place ratings');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
