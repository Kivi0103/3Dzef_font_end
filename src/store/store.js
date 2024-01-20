import { createStore } from 'vuex'

export default createStore({
  state: {
    video_src: '',
    video_name: '',
    identifier: '',
    is_analyzed: false,
    table_header: [],
    table_data: [],
    indexLine: [],
  },
  mutations: {
    setVideoSrc(state, newSrc) {
      state.video_src = newSrc
    },
     setVideoName(state, name) {
      state.video_name = name
    },
    setIdentifier(state, identifier) {
      state.identifier = identifier
    },
    setIsAnalyzed(state, is_analyzed){
      state.is_analyzed = is_analyzed
    },
    setTableHeader(state, header){
      state.table_header = []
      let headers = header
        for (let headersKey in headers) {
          let h = {
            prop: headers[headersKey],
            label: headers[headersKey]
          }
          state.table_header.push(h)
        }
    },
    setTableData(state, table_data){
      state.table_data = table_data
    },
    setIndexLine(state, indexLine){
      state.indexLine = indexLine
    }
  }
})