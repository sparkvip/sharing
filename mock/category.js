/* eslint-disable func-names */
const data = [{
    id: '1',
    name: '021',
    category: 'DEFAULT',
    username: 'HAP_PROD_CROSS_DEV	',
    fileType: 'docx',

}]
export default {
    'get /api/sys/category/query': function (_req, res) {
        let i = 0;
        for (i = 0; i <= 100; i += 1) {
            const t = {
                id: i,
                name: `name${i}`,
                category: 'DEFAULT',
                username: 'HAP_PROD_CROSS_DEV',
                fileType: 'docx',
            }
            data.push(t)
        }
        setTimeout(() => {
            res.json({
                data,
            })
        }, 250)
    }
}