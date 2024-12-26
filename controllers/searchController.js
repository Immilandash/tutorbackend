exports.search = async (req, res) => {
    const { longitude, latitude, role } = req.query;

    try {
        const users = await User.find({
            role,
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: 5000, // 5km radius
                },
            },
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
