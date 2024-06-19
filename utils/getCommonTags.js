module.exports = (companyData, limit) => {
    let tags = new Map();

    for (const company of companyData) {
        for (const tag of company.type) {
            if (tags.get(tag) == undefined) {
                tags.set(tag, 1);
            } else {
                tags.set(tag, tags.get(tag) + 1);
            }
        }
    }

    const tagsArray = Array.from(tags.entries());
    tagsArray.sort((a, b) => b[1] - a[1]);
    const topTags = new Map(tagsArray.slice(0, limit));

    return topTags;
};
