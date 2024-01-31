const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Excel = require('exceljs');
const ProdcutModel = require('../models/product');


exports.getFilter = async (req, res) => {
    try {
        const data = await ProdcutModel.getFilter()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getAllProduct = async (req, res) => {
    const body = req.query
    try {
        const data = await ProdcutModel.getAllProduct(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.getDetailProduct = async (req, res) => {
    const body = req.params.id
    try {
        const data = await ProdcutModel.getDeatilProduct(body);
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
    
}   
exports.fileImport = async (req, res) => {
    let workbook = new Excel.Workbook()
    await workbook.csv.readFile('./public/file/item.csv')
    let products = []
    let jsonData = []
    workbook.worksheets.forEach(function(sheet) {
        let firstRow = sheet.getRow(1);
        if (!firstRow.cellCount) return;
        let keys = firstRow.values;
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            let values = row.values
            let obj = {};
            for (let i = 1; i < keys.length; i ++) {
                if(keys[i] == 'Items Name (Do Not Edit)') {
                    obj['name'] = values[i];
                }
                if(keys[i] == 'Category') {
                    obj['category'] = values[i]
                }
                if(keys[i] == 'Brand Name') {
                    obj['brand'] = values[i]
                }
                if(keys[i] == 'Variant name') {
                    if(values[i] == undefined) {
                        obj['variant_name'] = ''
                    } else {
                        obj['variant_name'] = values[i]
                    }
                }
                if(keys[i] == 'Basic - Price') {
                    if(values[i] == undefined) {
                        obj['price'] = null
                    } else {
                        obj['price'] = values[i]
                    }
                }
            }
            let dup = products.find(el => el.name == obj.name)
            if(!dup) {
                products.push({name: obj.name, category: obj.category, brand: obj.brand, items: []})
            }
            dup = products.find(el => el.name == obj.name)
            if(dup) {
               let i =  products.findIndex(el => el.name == obj.name)
               products[i].items.push({name: obj.variant_name, price: obj.price})
            }
            jsonData.push(obj);
        })
    })
    try {
        await ProdcutModel.importPorduct(products)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.insertProduct = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        name: data.name,
        brand_id: JSON.parse(data.brand_id),
        category_id: JSON.parse(data.category_id),
        description: data.description,
        image: '',
        item_variants: JSON.parse(data.item_variants)
    }

    if(req.file) {
        const filePath = `./public/img/products/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/products/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await ProdcutModel.insertProduct(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateProduct = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        id: data.id,
        name: data.name,
        brand_id: JSON.parse(data.brand_id),
        category_id: JSON.parse(data.category_id),
        description: data.description,
        image: '',
        item_variants: JSON.parse(data.item_variants)
    }
    if(req.file) {
        const filePath = `./public/img/products/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/products/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await ProdcutModel.updateProduct(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.exportProduct = async (req, res) => {
    const data = await ProdcutModel.exportProduct()
    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Items')
    worksheet.columns = [
        {key: 'variant_id', width: 15},
        {key: 'sku',  width: 10},
        {key: 'name', width: 35},
        {key: 'brand',  width: 15},
        {key: 'category',  width: 25},
        {key: 'variant',  width: 20},
        {key: 'price',  width: 15},
    ]
    worksheet.getRow(1).values = ['Internal ID variant', 'SKU', 'Items Name', 'Brand Name', 'Category Name', 'Variant Name', 'Basic Price']
    worksheet.addRows(data)
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
    );
    await workbook.xlsx.write(res);
    res.status(200).end();
}