class AbstractRepository {
    constructor(db) {
        this.db = db;
    }

    findAll(options = {}) {
        return this.model.findAll(options);
    }

    findOne(options = {}) {
        return this.model.findOne(options);
    }

    findById(id, options = {}) {
        return this.model.findByPk(id, options);
    }

    create(options = {}, id) {
        return this.model.create(options, id);
    }

    delete(id) {
        this.model.destroy({
            where: {
                id
            }
        });
    }
}

module.exports = AbstractRepository;
