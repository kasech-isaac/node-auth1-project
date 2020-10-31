const db=require("../database/config")

function find() {
    return db("users")
    .select("id", "username")
}

async function add(user) {
    const [id] = await db("users").insert(user)
	return findById(id)
}

function findBy(info) {
	return db("users")
		.select("id", "username", "password")
		.where(info)
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}
module.exports = {
    find,
    add,
    findBy,
    findById
}