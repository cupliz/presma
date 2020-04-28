export const formatRibuan = (x) => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : x
}