import config from '../../config';

export default async function toggleDocs(request, response, next) {
    if (config.enableDocs) {
        return next();
    }

    return response.sendStatus(403);
}
