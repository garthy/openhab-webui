import dayjs from 'dayjs'
import 'dayjs/locale/de'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

export default {
  get (component, startTime, endTime, chart, device, items) {
    let options = Object.assign({}, component.config)
    if (options.confine === undefined) options.confine = true

    if (component.config.smartFormatter) {
      options.formatter = (params, ticket, callback) => {
        let tooltip = ''
        if (params.componentType === 'markArea') {
          tooltip += `<div>${dayjs(params.data.coord[0][0]).format('llll')}<br />${dayjs(params.data.coord[1][0]).format('llll')}</div>`
          tooltip += params.marker
          tooltip += params.name
          if (params.value) tooltip += ': ' + params.value
          return tooltip
        }
        if (!params[0] || !params[0].axisType) return
        if (params[0].axisType === 'xAxis.time') {
          tooltip += `<div>${dayjs(params[0].axisValue).format('llll')}</div>` // ('dd DD.MM.YYYY HH:mm:ss')
        }
        params.forEach((s) => {
          if (s.seriesId) {
            const [seriesType, itemName] = s.seriesId.split('#')
            if (seriesType === 'oh-time-series') {
              let item = chart.items[itemName]
              let state = s.data[1]
              if (item) {
                const stateDescription = item.stateDescription || {}
                if (stateDescription.format) {
                }
              }

              tooltip += s.marker + ' ' + s.seriesName + ': ' + state + '<br />'
            }
          }
        })

        return tooltip
      }
    }

    return options
  }
}
