export const getRecommendations = async (term: string) => {
    console.log("Delayed for 3 seconds.");
    await new Promise(r => setTimeout(r, 3000));
    return [
        {
            id: '11',
            name: 'Who Told You (feat. Drake)',
            images: [
                { url: 'https://allmusicmagazine.com/wp-content/uploads/2023/07/unnamed-12.jpeg', height: 1, width: 1 }
            ],
            duration_ms: 210000,
            artists: [
                {
                    name: 'J Hus'
                },
                {
                    name: 'Drake'
                }
            ],
            album: {
                name: 'Beautiful and Brutal Yard'
            }
        } as any,
        {
            id: '22',
            name: 'Rich Flex',
            images: [
                { url: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Her_Loss.jpeg', height: 1, width: 1 }
            ],
            duration_ms: 210000,
            artists: [
                {
                    name: 'Drake'
                },
                {
                    name: '21 Savage'
                }
            ],
            album: {
                name: 'Her Loss'
            }
        } as any
    ];
}