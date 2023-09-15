import {
  Cesium3DTileset,
  Viewer,
  HeadingPitchRange,
  ScreenSpaceEventHandler,
  defined,
  Color,
  ScreenSpaceEventType,
  Cartographic,
  ArcType,
  PolylineArrowMaterialProperty,
  Entity
} from 'cesium';
import 'cesium/Widgets/widgets.css';

const pointColor = (type: string): Color => {
  switch (type) {
    case 'intersection':
      return Color.RED;
    case 'in_out_intersection':
      return Color.BLUE;
    case 'station':
      return Color.GREEN;
    case 'construct':
      return Color.PINK;
    default:
      return Color.YELLOW;
  }
};
const pointPixelSize = (type: string): number => {
  switch (type) {
    case 'intersection':
      return 10;
    case 'in_out_intersection':
      return 10;
    case 'station':
      return 10;
    case 'construct':
      return 10;
    default:
      return 1;
  }
};

export const initCesiumContainer = (): Viewer => {
  return new Viewer('cesium-container', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    baseLayer: false,
    skyBox: false,
    skyAtmosphere: false,
    globe: false,
    requestRenderMode: true
  });
};

export const initViewer = async (): Promise<void> => {
  const viewer = initCesiumContainer();
  const response = await fetch('http://localhost:8003/map.json');
  const data = await response.json();

  try {
    const tileset = await Cesium3DTileset.fromUrl('http://localhost:8003/3dtiles/tileset.json');
    viewer.scene.primitives.add(tileset);
    // zoom to tileset and position camera in birds-eye view
    await viewer.zoomTo(tileset, new HeadingPitchRange(0, -90, 0));
    // listen for left mouse click event and draw a point (via Entities API) at picked position
    const handler: ScreenSpaceEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedPosition = viewer.scene.pickPosition(event.position);
      if (defined(pickedPosition)) {
        // draw a point at picked position or moved to the new picked position
        console.log(`picked position: ${pickedPosition}`);
        viewer.entities.add({
          name: 'picked position',
          position: pickedPosition,
          point: {
            pixelSize: 5,
            color: Color.RED,
            outlineColor: Color.WHITE,
            outlineWidth: 2
          }
        });
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    const nodes = new Map();
    for (const node of data.map.list_node.node) {
      nodes.set(node._id, {
        type: node._type,
        name: node._name,
        waypoint: node._waypoint_id
      });
      // console.log(`node:${JSON.stringify(nodes.get(node._id))} for node with _id: ${node._id}`)
    }
    const lanes = new Map();
    for (const lane of data.map.list_lane.lane) {
      lanes.set(lane._id, {
        nodes: {
          begin: lane._begin_node,
          end: lane._end_node
        },
        width: lane._width,
        waypoints: {
          from: lane.waypoint_used._from_id,
          to: lane.waypoint_used._to_id
        }
      });
      // console.log(`lane:${JSON.stringify(lanes.get(lane._id))} for lane with _id: ${lane._id}`)
    }
    const waypoints = new Map();
    for (const waypoint of data.map.list_waypoint.waypoint) {
      waypoints.set(waypoint._id, {
        longitude: parseFloat(waypoint._lon),
        latitude: parseFloat(waypoint._lat)
      });
      // console.log(`waypoint:${JSON.stringify(waypoints.get(waypoint._id))}`)
    }
    for (const lane of lanes) {
      const fromWaypoint = waypoints.get(lane[1].waypoints.from);
      const toWaypoint = waypoints.get(lane[1].waypoints.to);
      const from = Cartographic.toCartesian(Cartographic.fromDegrees(fromWaypoint.longitude, fromWaypoint.latitude, -20.0));
      const to = Cartographic.toCartesian(Cartographic.fromDegrees(toWaypoint.longitude, toWaypoint.latitude, -20.0));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const line: Entity = viewer.entities.add({
        name: 'Purple straight arrow at height',
        polyline: {
          positions: [from, to],
          width: 20,
          arcType: ArcType.NONE,
          material: new PolylineArrowMaterialProperty(Color.WHITE)
        }
      });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const typeOfWaypoint = (waypointIdentifier: unknown) => {
      for (const node of nodes) {
        if (node[1].waypoint === waypointIdentifier) {
          return node[1].type;
        }
      }
    };

    for (const waypoint of waypoints) {
      const longitude = waypoint[1].longitude;
      const latitude = waypoint[1].latitude;
      const type = typeOfWaypoint(waypoint[0]);
      const pixelSize = pointPixelSize(type);
      const color = pointColor(type);
      const geowaypoint = Cartographic.fromDegrees(longitude, latitude, -20.5);
      const point = Cartographic.toCartesian(geowaypoint);

      viewer.entities.add({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: 'waypoint' + waypoint._id,
        position: point,
        point: {
          pixelSize: pixelSize,
          color: color,
          outlineColor: color,
          outlineWidth: 1
        }
      });
    }
  } catch (error) {
    console.log(`Error loading tileset: ${error}`);
  }
};
