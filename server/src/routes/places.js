import express from 'express';

const router = express.Router();

// =============================================================================
// GET /api/places - List All Places
// =============================================================================

router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 50 } = req.query;

        const where = {};

        if (category) {
            where.category = { name: category };
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { titleVi: { contains: search } },
                { description: { contains: search } }
            ];
        }

        const places = await req.prisma.place.findMany({
            where,
            include: { category: true },
            take: parseInt(limit),
            orderBy: { rating: 'desc' }
        });

        res.json(places);
    } catch (error) {
        console.error('Get places error:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

// =============================================================================
// GET /api/places/:id - Get Place Details
// =============================================================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const place = await req.prisma.place.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);
    } catch (error) {
        console.error('Get place error:', error);
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});

// =============================================================================
// GET /api/places/category/:categoryName - Get Places by Category
// =============================================================================

router.get('/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;

        const places = await req.prisma.place.findMany({
            where: {
                category: { name: categoryName }
            },
            include: { category: true },
            orderBy: { rating: 'desc' }
        });

        res.json(places);
    } catch (error) {
        console.error('Get places by category error:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

export default router;
