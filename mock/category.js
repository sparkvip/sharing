let data = [{
    id: '1',
    name: '021',
    category: 'DEFAULT',
    username: 'HAP_PROD_CROSS_DEV	',
    fileType: 'docx',
  
}]
export default {
    'get /api/sys/category/query': function (req, res) {
        setTimeout(() => {
            res.json({
                data: data,
            })
        }, 250)
    }
}