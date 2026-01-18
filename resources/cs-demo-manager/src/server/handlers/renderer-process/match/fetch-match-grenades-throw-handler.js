import { fetchShots } from 'csdm/node/database/shots/fetch-shots';
import { GrenadeName } from 'csdm/common/types/counter-strike';
import { fetchGrenadeBounces } from 'csdm/node/database/grenade-bounce/fetch-grenade-bounces';
import { fetchGrenadeProjectileDestroy } from 'csdm/node/database/grenade-projectile-destroy/fetch-grenade-projectiles-destroy';
import { handleError } from '../../handle-error';
export async function fetchMatchGrenadesThrowHandler(checksum) {
    try {
        const grenadeShots = await fetchShots({
            checksum,
            weaponNames: Object.values(GrenadeName),
        });
        const grenadeBounces = await fetchGrenadeBounces(checksum);
        const projectilesDestroy = await fetchGrenadeProjectileDestroy(checksum);
        const grenadesThrow = [];
        for (const shot of grenadeShots) {
            const bounces = grenadeBounces.filter((bounce) => {
                return bounce.projectileId === shot.projectileId && bounce.roundNumber === shot.roundNumber;
            });
            const positions = [{ x: shot.x, y: shot.y, z: shot.z }];
            for (const bounce of bounces) {
                positions.push({ x: bounce.x, y: bounce.y, z: bounce.z });
            }
            const projectileDestroy = projectilesDestroy.find((projectile) => {
                return projectile.projectileId === shot.projectileId && projectile.roundNumber === shot.roundNumber;
            });
            if (projectileDestroy !== undefined) {
                positions.push({ x: projectileDestroy.x, y: projectileDestroy.y, z: projectileDestroy.z });
            }
            const grenadeThrow = {
                id: String(shot.id),
                tick: shot.tick,
                roundNumber: shot.roundNumber,
                projectileId: shot.projectileId,
                grenadeName: shot.weaponName,
                positions: positions,
                throwerSteamId: shot.playerSteamId,
                throwerName: shot.playerName,
                throwerSide: shot.playerSide,
                throwerVelocityX: shot.playerVelocityX,
                throwerVelocityY: shot.playerVelocityY,
                throwerVelocityZ: shot.playerVelocityZ,
                throwerYaw: shot.playerYaw,
                throwerPitch: shot.playerPitch,
            };
            grenadesThrow.push(grenadeThrow);
        }
        return grenadesThrow;
    }
    catch (error) {
        handleError(error, 'Error while fetching grenades throw');
    }
}
//# sourceMappingURL=fetch-match-grenades-throw-handler.js.map