const Tool = require('../models/Tool');
const User = require('../models/User');


module.exports = {
    async store(req, res){
        const { filename } = req.file;
        const { action } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(400).json({ error: 'User does not exists' });
        }

        //filename = filename.trim();

        const tool = await Tool.create({
            user: user_id,
            action: action,
            icon: filename,
        })

        return res.json({ ok: true });

    }
    
}