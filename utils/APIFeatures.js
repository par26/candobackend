class APIFeatures {
    query;
    queryObject;

    /**
     * Constructor to initialize the query and query object
     * @param {Object} query - Mongoose query object
     * @param {Object} queryObject - Request query parameters
     */
    constructor(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject;
    }

    /**
     * Method to filter the query based on query parameters
     * @returns {APIFeatures} - The instance of APIFeatures with the filtered query
     */
    filter() {
        const queryObject = { ...this.queryObject }; // Deep copy the query object
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(field => delete queryObject[field]); // Remove excluded fields from the query object

        // Convert query object to a string and add $ to certain operators
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            matched => `$${matched}`
        );
        const newQueryObject = JSON.parse(queryString); // Convert string back to object

        this.query = this.query.find(newQueryObject); // Apply the filter to the query
        return this;
    }

    /**
     * Method to sort the query based on query parameters
     * @returns {APIFeatures} - The instance of APIFeatures with the sorted query
     */
    sort() {
        if (
            this.queryObject.sort &&
            typeof this.queryObject.sort === "string"
        ) {
            const sortBy = this.queryObject.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy); // Apply sorting to the query
        } else {
            this.query = this.query.sort("-createdAt name"); // Default sorting if none is specified
        }

        return this;
    }

    /**
     * Method to limit the fields returned in the query results
     * @returns {APIFeatures} - The instance of APIFeatures with limited fields
     */
    limitFields() {
        if (
            this.queryObject.fields &&
            typeof this.queryObject.fields === "string"
        ) {
            const fields = this.queryObject.fields.split(",").join(" ");
            this.query = this.query.select(fields); // Select specified fields
        } else {
            this.query = this.query.select("-__v"); // Exclude the version field by default
        }

        return this;
    }

    /**
     * Method to paginate the query results
     * @returns {APIFeatures} - The instance of APIFeatures with pagination applied
     */
    paginate() {
        const page = Number(this.queryObject.page) || 1;
        const limit = Number(this.queryObject.limit) || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit); // Apply pagination to the query
        return this;
    }
}

module.exports = APIFeatures;
