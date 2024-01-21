// pages/api/generate-background.js

import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { city, ageGroup } = req.body;

    try {
      const client = new OpenAI(process.env.OPENAI_API_KEY);

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `${city} style background for ${ageGroup} `,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      const imageUrl = response.data[0].url;
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ message: 'Error generating image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
