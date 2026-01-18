import { lastArrayItem } from './last-array-item';
export function fillMissingTicks(objects) {
    if (objects.length < 2) {
        return objects;
    }
    const objectsByTick = new Map();
    for (const obj of objects) {
        const existing = objectsByTick.get(obj.tick);
        if (existing) {
            existing.push(obj);
        }
        else {
            objectsByTick.set(obj.tick, [obj]);
        }
    }
    const minTick = objects[0].tick;
    const maxTick = lastArrayItem(objects).tick;
    const newObjects = [];
    let lastTickObjects = [];
    for (let tick = minTick; tick <= maxTick; tick++) {
        const currentObjects = objectsByTick.get(tick);
        if (currentObjects) {
            newObjects.push(...currentObjects);
            lastTickObjects = currentObjects;
        }
        else {
            newObjects.push(...lastTickObjects.map((obj) => ({
                ...obj,
                id: `${obj.id}_filled`,
                tick,
            })));
        }
    }
    return newObjects;
}
//# sourceMappingURL=fill-missing-ticks.js.map