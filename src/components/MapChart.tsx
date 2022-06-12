import React, { FC, memo, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { Box } from '@mui/material';
import { State } from "../types/types";
import { geoUrl } from '../static/polandMap';

//const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
//const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/poland/poland-provinces.json";

interface MapChartProps {
  selectedStates: number[];
  setSelectedStates: (states: number[]) => void;
}

const MapChart: FC<MapChartProps> = ({ selectedStates, setSelectedStates }) => {

  const handleSelect = (state: number) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  return (
    <Box >
      <ComposableMap
        style={{ width: '90%', height: '400px' }}
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-19, -52.3, 18],
          scale: 6000,
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                data-tip={`${geo.properties.VARNAME_1} ID: ${geo.properties.ID_1}`}
                style={{
                  default: {
                    fill: selectedStates.includes(geo.properties.ID_1)
                      ? "#FFB01F"
                      : "gray",
                    outline: "none",
                    stroke: selectedStates.includes(geo.properties.ID_1)
                      ? "#F59F00"
                      : "none",
                    strokeWidth: selectedStates.includes(geo.properties.ID_1)
                      ? "2px"
                      : "none"
                  },
                  hover: {
                    fill: selectedStates.includes(geo.properties.ID_1)
                      ? "#FFB01F"
                      : "#0593B3",
                    outline: "none",
                    stroke: selectedStates.includes(geo.properties.ID_1)
                      ? "#CC8500"
                      : "#064A60",
                    strokeWidth: "2px"
                  },
                  pressed: {
                    fill: "#8FAD88",
                    outline: "#63845C"
                  }
                }}
                onMouseEnter={() => {
                  ReactTooltip.rebuild();
                }}
                onClick={() => {
                  handleSelect(geo.properties.ID_1);
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default memo(MapChart);
