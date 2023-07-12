export const getRecommendations = async (term: string) => {
    console.log("Delayed for 3 seconds.");
    await new Promise(r => setTimeout(r, 3000));
    return [];
}