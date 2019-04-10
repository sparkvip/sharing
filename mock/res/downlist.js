/* eslint-disable func-names */
const data = [
    { key: 1, code: 'COMPUTER', name: '计算机' }, 
    { key: 2, code: 'ENGLISH', name: '英语' },
    { key: 3, code: 'MATH', name: '数学' },
    { key: 4, code: 'PHYSICAL', name: '物理' },
    { key: 5, code: 'CHEMISTRY', name: '化学' }
]
export default {
    'post /api/sys/downlist/query': function (_req, res) {
        setTimeout(() => {
            res.json({
                data
            })
        }, 250)
    }
}