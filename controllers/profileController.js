exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
