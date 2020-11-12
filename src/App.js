import React, {useState, useEffect}from 'react'
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'
import {prettyPrintStrat} from './util'

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Typography
}from'@material-ui/core'

function App() {
  const [countries,setCountries]=useState([])
  const [country, setCountry]=useState("worldwide")
  const [countryInfo,setCountryInfo]=useState({})
  const [tableData,setTableData]=useState([])
  const [mapCenter, setMapCenter]=useState({lat:34.80746, lng:-40.4796})
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries]=useState([])
  const [casesType,setCasesType]=useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response)=>response.json())
      .then((data)=>{
        setCountryInfo(data)
      })
  }, [])
  
  useEffect(() => {
    const getCountriesData= async()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response)=>response.json())
      .then((data)=>{
        const dataCountries=data.map((country)=>(
          {name:country.country, //Romania
            value:country.countryInfo.iso2, //RO
          }))

          const sortedData=sortData(data)
          setTableData(sortedData)
          setCountries(dataCountries)
          setMapCountries(data)
        })
      }
      getCountriesData()
    }, [])
    

    const onCountryChange= async (e)=>{
      const countrycode=e.target.value
      setCountry(countrycode)

      const url=countrycode==='worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countrycode}`
      await fetch(url)
        .then((response)=>response.json())
        .then(data=>{
          console.log(data)
          setCountry(countrycode)
          setCountryInfo(data)
          setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long});
          // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        })
    }
  return (
    <div className="app">
      <div className="app-left">
        <div className="app-header"> 
          <div className='app-title'> Covid 19 Tracker <span> </span> 
            <span className ='app-credit'> Credits to </span> 
            <a className='app-credit-link'
            href='https://www.youtube.com/channel/UCqrILQNl5Ed9Dz6CGMyvMTQ'>Clever Programmer
            </a>
          </div>   
            <FormControl className='app-dropdown'>
              <Select variant='outlined'value={country} onChange={onCountryChange}>
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country)=>(
                  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="div-app-stats">
            <InfoBox 
              isRed
              //if cases type ==cases this one will get active
              active={casesType==='cases'}
              onClick={(e)=>setCasesType('cases')}
              title='Coronavirus Cases'
              cases={prettyPrintStrat(countryInfo.todayCases)} 
              total={prettyPrintStrat(countryInfo.cases)}
            />
            <InfoBox 
              //if cases type ==cases this one will get active
              active={casesType==='recovered'}
              onClick={(e)=>setCasesType('recovered')}
              title={'Recovered'}
              cases={prettyPrintStrat(countryInfo.todayRecovered)} 
              total={prettyPrintStrat(countryInfo.recovered)}
            />
            <InfoBox 
              isRed
              //if cases type ==cases this one will get active
              active={casesType==='deaths'}
              onClick={(e)=>setCasesType('deaths')}
              title={'Deaths'}
              cases={prettyPrintStrat(countryInfo.todayDeaths)} 
              total={prettyPrintStrat(countryInfo.deaths)}
            />
          </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}  
        />
      </div>
      <Card className="app-right">
          <CardContent>
            <div className="cases-by-country">Live Cases By Country</div>
            <Table countries={tableData}></Table>
                <div className="cases-by-country">{country} new {casesType}</div>
            <LineGraph casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
