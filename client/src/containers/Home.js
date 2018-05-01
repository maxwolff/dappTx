import React, { Component } from 'react'
import AppBar from '../components/AppBar'
import Sidebar from '../components/Sidebar'
import StockChart from '../components/StockChart'
import ChartConfig from '../components/ChartConfig'
import axios from 'axios'
import { cloneDeep } from 'lodash'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
            exampleAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
            volConfig: cloneDeep(ChartConfig),
            fnConfig: cloneDeep(ChartConfig),
            isEmpty: true,
            isLoading: false
        }

        this.volChart = React.createRef()    //chart component refs for imperative loading animations
        this.fnChart = React.createRef()
    }

    callApi = async newAddress => {
        const startTime = '/0x55b9cb70'     //Ethereum start date: 2015-07-30; Unix hex timestamp
        const endTime = '/0x' + Math.round(Date.now()/1000.0).toString(16)    //convert current time to hex timestamp

        const url = '/api/' + newAddress + startTime + endTime
        console.log(url)

        axios.get(url).then(response => {   //call API with URL to get data
            const data = response.data

            const volSeries = Object.keys(data).map(elem => {   //map contract data for chart series config
                const epoch = Math.round(new Date(elem).getTime())
                const pct = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']
                return [epoch, pct]
            })

            const fnSeries = Object.keys(data).reduce((series, elem) => {   //reduce function data for chart series config
                const epoch = Math.round(new Date(elem).getTime())
                Object.keys(data[elem].functions).reduce((arr, func) => {
                    const index = series.findIndex(series => series['name'] === func)
                    if (index < 0) {
                        series.push({
                            data: [[epoch, data[elem].functions[func]]],
                            name: func,
                            showInNavigator: true
                        })
                        return series
                    }
                    else {
                        series[index].data.push([epoch, data[elem].functions[func]])
                        return series
                    }
                }, [])
                return series
            }, [])

            const newVolConfig = cloneDeep(this.state.volConfig)    //create new chart configs with fetched data
            newVolConfig.series[0].data = volSeries
            const newFnConfig = cloneDeep(this.state.fnConfig)
            newFnConfig.series = fnSeries

            this.setState({
                volConfig: newVolConfig,    //update charts with new configs
                fnConfig: newFnConfig,
                isLoading: false
            })

            this.volChart.current.hideLoading()     //hide loading states post-render
            this.fnChart.current.hideLoading()

        }).catch(error => {
            console.log(error)
        })
    }

    renderAddress = newAddress => {
        this.volChart.current.showLoading()     //trigger loading states before rerender
        this.fnChart.current.showLoading()

        this.setState({
            address: newAddress,    //update address bar, remove chart empty state
            isEmpty: false,
            isLoading: true
        })

        this.callApi(newAddress)   //get chart data for a new address
    }

    loadExample = event => {
        event.preventDefault()
        this.renderAddress(this.state.exampleAddress)
    }

    render() {
        return (
            <div className="app-container">
                <AppBar address={this.state.address} enterAddress={this.renderAddress} />
                <Sidebar loadExample={this.loadExample} />
                <main className="charts">
                    <StockChart ref={this.volChart} config={this.state.volConfig} title="Contract Volume" subtitle="(percentage of sampled Ethereum transactions)" isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} loadExample={this.loadExample} />
                    <StockChart ref={this.fnChart} config={this.state.fnConfig} title="Contract Function Calls" isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} loadExample={this.loadExample} />
                </main>
            </div>
        )
    }
}
export default Home