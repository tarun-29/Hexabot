/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import { LoggerService } from '@nestjs/common';
import { Cache } from 'cache-manager';

export function Cacheable(cacheKey: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache: Cache = this.cacheManager;
      const logger: LoggerService = this.logger; // Access the logger from the instance

      if (!cache) {
        throw new Error(
          'Cannot use Cacheable() decorator without injecting the cache manager.',
        );
      }

      if (!logger) {
        throw new Error('Cacheable() requires the the logger service.');
      }

      // Try to get cached data
      try {
        const cachedResult = await cache.get(cacheKey);
        if (cachedResult) {
          logger.debug(`Cache hit for key: ${cacheKey}`);
          return cachedResult;
        }
      } catch (error) {
        logger.error(`Cache get error for key: ${cacheKey}:`, error);
      }

      // Call the original method if cache miss
      const result = await originalMethod.apply(this, args);

      // Set the new result in cache
      try {
        await cache.set(cacheKey, result);
        logger.debug(`Cache set for key: ${cacheKey}`);
      } catch (error) {
        logger.error(`Cache set error for key: ${cacheKey}:`, error);
      }

      return result;
    };

    return descriptor;
  };
}
