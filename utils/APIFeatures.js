class APIFeatures {
	query;
	queryObject;

	constructor(query, queryObject) {
		this.query = query;
		this.queryObject = queryObject;
	}

	filter() {
		const queryObject = { ...this.queryObject }; // Deep copy the query object
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach(field => delete queryObject[field]);

		let queryString = JSON.stringify(queryObject);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			matched => `$${matched}`
		);
		const newQueryObject = JSON.parse(queryString);

		this.query = this.query.find(newQueryObject);
		return this;
	}

	sort() {
		if (
			this.queryObject.sort &&
			typeof this.queryObject.sort === "string"
		) {
			const sortBy = this.queryObject.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("name");
		}

		return this;
	}

	limitFields() {
		if (
			this.queryObject.fields &&
			typeof this.queryObject.fields === "string"
		) {
			const fields = this.queryObject.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}

		return this;
	}

	paginate() {
		const page = Number(this.queryObject.page) || 1;
		const limit = Number(this.queryObject.limit) || 100;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
