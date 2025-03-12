export default eventHandler(async (event) => {
  const { pathname, businessId } = getRouterParams(event)

  const path = `${businessId}/files/${pathname}`

  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  return hubBlob().serve(event, path)
})
