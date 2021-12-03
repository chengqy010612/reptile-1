const cheerio = require("cheerio");
const axios = require("axios")
const fs = require("fs")
const url = require("url")
const path = require("path")

let httpUrl = "http://www.dtzhuanjia.com/"
axios.get(httpUrl).then(res => {
    let $ = cheerio.load(res.data)
    // let title = $('.evaluateBlock.initList .item .evaluateTx').text()
    // $('.evaluateBlock.initList .btnArea .toDetail').each((i, element) => {
    //    let url = $(element).attr('href')
    //    console.log(title);
    //     detailPage(url)
    // })
 $('.evaluateBlock.initList .item').each((i, element) => {
     let url = $(element).find('.btnArea .toDetail').attr('href')
     let title = $(element).find('.evaluateTx').text()
     fs.mkdir('./img/'+ title,err => {
         if(err){
             console.log(err);
         }else{
             console.log("创建目录成功");
         }
     })
     console.log(title);
     detailPage(url,title)
    })
})

async function detailPage(url, title){   //具体页面
    axios.get(url).then(res => {
        let $ = cheerio.load(res.data)
        $('.blockDiv .item img').each((i, element) => {
            let imgUrl = $(element).attr('src')
            console.log(imgUrl);
            let extName = path.extname(imgUrl)
            // 写入地址
            let writePath = `img/${title}/${title}-${i}${extName}`
            let ws = fs.createWriteStream(writePath)
            axios.get(imgUrl,{responseType:'stream'}).then(res => {
                res.data.pipe(ws)
            })
        })
    })
}