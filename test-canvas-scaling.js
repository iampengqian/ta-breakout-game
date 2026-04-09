import canvasScaler from './src/utils/CanvasScaler.js';

// Test 1: Verify virtual resolution constants
console.log('Test 1: Virtual resolution constants');
console.log('VIRTUAL_WIDTH:', canvasScaler.VIRTUAL_WIDTH);
console.log('VIRTUAL_HEIGHT:', canvasScaler.VIRTUAL_HEIGHT);

// Test 2: Verify screenToVirtual method exists and works
console.log('\nTest 2: Coordinate mapping');
const testVirtual = canvasScaler.screenToVirtual(400, 300);
console.log('Screen (400, 300) -> Virtual:', testVirtual);

// Test 3: Verify scale method
console.log('\nTest 3: Scale method');
console.log('Scale factor:', canvasScaler.getScale());

// Test 4: Verify virtual resolution method
console.log('\nTest 4: Virtual resolution method');
console.log('Virtual resolution:', canvasScaler.getVirtualResolution());

// Test 5: Simulate window resize
console.log('\nTest 5: Window resize simulation');
// Mock window size
global.innerWidth = 1600;
global.innerHeight = 1200;

// Create and dispatch resize event
const resizeEvent = new Event('resize');
window.dispatchEvent(resizeEvent);

console.log('After resize:');
console.log('Scale factor:', canvasScaler.getScale());

// Test 6: Test coordinate mapping at different positions
console.log('\nTest 6: Coordinate mapping at different positions');
const positions = [
    { screen: { x: 0, y: 0 }, expected: { x: 0, y: 0 } },
    { screen: { x: 800, y: 600 }, expected: { x: 800, y: 600 } },
    { screen: { x: 400, y: 300 }, expected: { x: 400, y: 300 } },
    { screen: { x: 200, y: 150 }, expected: { x: 200, y: 150 } }
];

positions.forEach((pos, index) => {
    const virtual = canvasScaler.screenToVirtual(pos.screen.x, pos.screen.y);
    console.log(`Position ${index + 1}:`, virtual);
});

// Test 7: Verify aspect ratio is maintained
console.log('\nTest 7: Aspect ratio validation');
const aspectRatio = canvasScaler.VIRTUAL_WIDTH / canvasScaler.VIRTUAL_HEIGHT;
const displayAspect = (window.innerWidth / canvasScaler.getScale()) / (window.innerHeight / canvasScaler.getScale());
console.log('Virtual aspect ratio:', aspectRatio);
console.log('Display aspect ratio:', displayAspect);

// Test 8: Verify canvas dimensions
console.log('\nTest 8: Canvas dimensions');
const canvas = document.querySelector('canvas');
if (canvas) {
    console.log('Canvas internal size:', canvas.width, 'x', canvas.height);
    console.log('Canvas display size:', canvas.offsetWidth, 'x', canvas.offsetHeight);
}

console.log('\nAll tests completed!');