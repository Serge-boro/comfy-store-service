const SchemaProduct = require('../moduleDB/moduleProducts')

const getProductsData = async (req, res) => {
  const { featured, search, company, category, order, price, shipping, page } =
    req.query

  function split(array, n) {
    let [...arr] = array
    var res = []
    while (arr.length) {
      res.push(arr.splice(0, n))
    }
    return res
  }

  const limit = Number(req.query.limit) || 9
  Number(page) || 1

  let result = await SchemaProduct.find({})
  result = Object.assign({}, result)[0]

  // let returnAll = { meta: result.meta, data: result.data }

  if (featured) {
    result.data = result?.data?.filter((item) => item.attributes.featured)
  }

  if (shipping && shipping !== 'false') {
    result.data = result?.data?.filter((item) => item.attributes.shipping)
  }

  if (search) {
    result.data = result.data.filter((item) => {
      const regex = new RegExp(search, 'i')
      return item.attributes.title.match(regex)
    })
  }

  if (category && category !== 'all') {
    result.data = result.data.filter((item) => {
      return item.attributes.category == category
    })
  }

  if (company && company !== 'all') {
    result.data = result.data.filter(
      (item) => item.attributes.company == company
    )
  }
  const min = Math.min(...result.data.map((item) => item.attributes.price))
  const max = Math.max(...result.data.map((item) => item.attributes.price))

  if (price && price < max) {
    result.data = result.data.filter((item) => {
      if (price < min || (price > 7000 && price < 10000)) return
      return item.attributes.price <= price
    })
  }

  if (order === 'a-z') {
    result.data = result.data.sort((a, b) =>
      a.attributes.title.localeCompare(b.attributes.title)
    )
  }
  if (order === 'z-a') {
    result.data = result.data.sort((a, b) =>
      b.attributes.title.localeCompare(a.attributes.title)
    )
  }
  if (order === 'low') {
    result.data = result.data.sort(
      (a, b) => a.attributes.price - b.attributes.price
    )
  }
  if (order === 'high') {
    result.data = result.data.sort(
      (a, b) => b.attributes.price - a.attributes.price
    )
  }

  result.meta.pagination.total = result.data.length
  result.meta.pagination.pageCount =
    Math.ceil(result.meta.pagination.total / limit) || 1

  if (page) {
    result.data = split(result.data, limit)[page - 1]
    result.meta.pagination.page = page
  }

  // result.meta.pagination.total = result.meta.pagination.total = 22

  res.status(200).json(result)
}

const getSingleProductsData = async (req, res) => {
  const { id: productId } = req.params

  let result = await SchemaProduct.find({})
  result = Object.assign({}, result)[0]
  result.data = result?.data?.filter((item) => {
    if (item.id === +productId) {
      return item
    }
  })
  res.status(200).json(result)
}

module.exports = { getProductsData, getSingleProductsData }
