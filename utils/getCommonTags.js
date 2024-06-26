// Export a function that processes company data to find the most common tags, limited by a specified number
module.exports = (companyData, limit) => {
    let tags = new Map();

    // Iterate over each company in the provided data
    for (const company of companyData) {
        // Iterate over each tag in the company's type array
        for (const tag of company.type) {
            // If the tag is not already in the map, add it with a count of 1
            if (tags.get(tag) == undefined) {
                tags.set(tag, 1);
            } else {
                // If the tag is already in the map, increment its count
                tags.set(tag, tags.get(tag) + 1);
            }
        }
    }

    // Convert the map to an array of [tag, count] pairs
    const tagsArray = Array.from(tags.entries());
    // Sort the array by count in descending order
    tagsArray.sort((a, b) => b[1] - a[1]);
    // Create a new map with the top tags, limited by the specified number
    const topTags = new Map(tagsArray.slice(0, limit));

    // Return the map of top tags
    return topTags;
};
