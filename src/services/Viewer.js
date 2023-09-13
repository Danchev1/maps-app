import {
  Cesium3DTileset,
  Viewer,
  HeadingPitchRange,
  ScreenSpaceEventHandler,
  defined,
  CallbackProperty,
  Color,
  ScreenSpaceEventType
} from 'cesium';
import 'cesium/Widgets/widgets.css';

export const initCesiumContainer = () => {
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

export const initViewer = async () => {
  const viewer = initCesiumContainer();

  try {
    const tileset = await Cesium3DTileset.fromUrl('http://localhost:8003/3dtiles/tileset.json');
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset, new HeadingPitchRange(0, -90, 0));
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    let point = null;
    let lastPickedPosition = null;
    handler.setInputAction((event) => {
      const pp = viewer.scene.pickPosition(event.position);
      if (defined(pp)) {
        lastPickedPosition = pp;
        if (point === null) {
          point = viewer.entities.add({
            name: 'picked position',
            position: new CallbackProperty((time, result) => lastPickedPosition.clone(result), false),
            point: {
              pixelSize: 5,
              color: Color.RED,
              outlineColor: Color.WHITE,
              outlineWidth: 2
            }
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  } catch (error) {
    console.log(`Error loading tileset: ${error}`);
  }
};
