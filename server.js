const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/exchange', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'Code required' });
    }
    
    try {
        const response = await axios.post('https://oauth.deriv.com/oauth2/token', 
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: '88258',
                redirect_uri: 'https://digitdiff.netlify.app'
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        
        if (response.data && response.data.access_token) {
            res.json({ success: true, token: response.data.access_token });
        } else {
            res.json({ error: 'No access_token received' });
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));