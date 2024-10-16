/**
 * @description Math utils
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
export default class Mathy {
  /**
   * Calculate intersection between two segments
   *
   * @param   {{x: number, y: number}[]}   AB
   * @param   {{x: number, y: number}[]}   CD
   * @returns {{x:number, y: number}|null}
   * @todo    Implement future version using linear algebra
   * @link    https://www.youtube.com/watch?v=5FkOO1Wwb8w&t=0s
   */
  static calculateIntersection(AB, CD) {
    /**
     * @note To calculate the point where two segments intersect,
     *       we can make use of our knowledge related to
     *       linear interpolation. We know that if we linearly interpolate
     *       between two points that make a segment, we can
     *       get a point within that segment. Taking this into consideration,
     *       where two segments intersect, that point should be shared.
     *       We can create a system of two equations where the
     *       `x` and `y` coordinates of the point where the two segments
     *       intersect, are equal. These `x` and `y` coordinates
     *       are defined using the linear interpolation formula in each
     *       segment:
     *
     *       ```
     *       x -> AX + (BX - AX) * t = CX + (DX - CX) * u
     *       y -> AY + (BY - AY) * t = CY + (DY - CY) * u
     *
     *       AX + (BX - AX) * t                    = CX + (DX - CX) * u
     *       AX + (BX - AX) * t - CX               = (DX - CX) * u
     *       (AX + (BX - AX) * t - CX) / (DX - CX) = u
     *       (AX + BXt - AXt - CX) / (DX - CX)     = u
     *
     *       AX + (BX - AX) * t = CX + (DX - CX) * u
     *            (BX - AX) * t = CX + (DX - CX) * u - AX
     *                        t = (CX + (DX - CX) * u - AX) / (BX - AX)
     *
     *       AY + (BY - AY) * t                = CY + (DY - CY) * u
     *       AY + (BY - AY) * t - CY           = (DY - CY) * u
     *       (AY + BYt - AYt - CY) / (DY - CY) = u
     *
     *       AY + (BY - AY) * t = CY + (DY - CY) * u
     *                        t = CY + (DY - CY) * u - AY
     *                        t = (CY + (DY - CY) * u - AY) / (BY - AY)
     *
     *       (AX + BXt - AXt - CX) / (DX - CX) = (AY + BYt - AYt - CY) / (DY - CY)
     *       (AX + BXt - AXt - CX) * (DY - CY) = (AY + BYt - AYt - CY) * (DX - CX)
     *
     *       (AX)(DY) + (BXt)(DY) - (AXt)(DY) - (CX)(DY) - (AX)(CY) - (BXt)(CY) + (AXt)(CY) + (CX)(CY)     = (AY)(DX) + (BYt)(DX) - (AYt)(DX) - (CY)(DX) - (AY)(CX) - (BYt)(CX) + (AYt)(CX) + (CY)(CX)
     *       (BXt)(DY) - (AXt)(DY) - (BXt)(CY) + (AXt)(CY) - (BYt)(DX) + (AYt)(DX) + (BYt)(CX) - (AYt)(CX) = (AY)(DX) - (CY)(DX) - (AY)(CX) + (CY)(CX) - (AX)(DY) + (CX)(DY) + (AX)(CY) - (CX)(CY)
     *       t ((BX)(DY) - (AX)(DY) - (BX)(CY) + (AX)(CY) - (BY)(DX) + (AY)(DX) + (BY)(CX) - (AY)(CX))     = (AY)(DX) - (CY)(DX) - (AY)(CX) + (CY)(CX) - (AX)(DY) + (CX)(DY) + (AX)(CY) - (CX)(CY)
     *                                                                                                   t = ((AY)(DX) - (CY)(DX) - (AY)(CX) + (CY)(CX) - (AX)(DY) + (CX)(DY) + (AX)(CY) - (CX)(CY)) / ((BX)(DY) - (AX)(DY) - (BX)(CY) + (AX)(CY) - (BY)(DX) + (AY)(DX) + (BY)(CX) - (AY)(CX))
     *
     *       (CY + (DY - CY) * u - AY) / (BY - AY) = (CX + (DX - CX) * u - AX) / (BX - AX)
     *       (CY + DYu - CYu - AY) / (BY - AY)     = (CX + DXu - CXu - AX) / (BX - AX)
     *       (CY + DYu - CYu - AY) * (BX - AX)     = (CX + DXu - CXu - AX) * (BY - AY)
     *
     *       (CY)(BX) + (DYu)(BX) - (CYu)(BX) - (AY)(BX) - (CY)(AX) - (DYu)(AX) + (CYu)(AX) + (AY)(AX)     = (CX)(BY) + (DXu)(BY) - (CXu)(BY) - (AX)(BY) - (CX)(AY) - (DXu)(AY) + (CXu)(AY) + (AX)(AY)
     *       (DYu)(BX) - (CYu)(BX) - (DYu)(AX) + (CYu)(AX) - (DXu)(BY) + (CXu)(BY) + (DXu)(AY) - (CXu)(AY) = (CX)(BY) - (AX)(BY) - (CX)(AY) + (AX)(AY) - (CY)(BX) + (AY)(BX) + (CY)(AX) - (AY)(AX)
     *       u ((DY)(BX) - (CY)(BX) - (DY)(AX) + (CY)(AX) - (DX)(BY) + (CX)(BY) + (DX)(AY) - (CX)(AY))     = (CX)(BY) - (AX)(BY) - (CX)(AY) + (AX)(AY) - (CY)(BX) + (AY)(BX) + (CY)(AX) - (AY)(AX)
     *                                                                                                   u = ((CX)(BY) - (AX)(BY) - (CX)(AY) + (AX)(AY) - (CY)(BX) + (AY)(BX) + (CY)(AX) - (AY)(AX)) / ((DY)(BX) - (CY)(BX) - (DY)(AX) + (CY)(AX) - (DX)(BY) + (CX)(BY) + (DX)(AY) - (CX)(AY))
     *       ```
     *
     *       In this explanation, it was considered that every divider
     *       cannot be `0`, to be able to divide by them
     *       Also, take into consideration that the `t`/`u` divider is `0`
     *       when both segments are parallel. In addition to that,
     *       the intersection only happens when `t` and `u` are between
     *       `0` and `1`. In other cases, the intersection is returned
     *       against the line formed by these segments and not by the segments
     *       itself
     */
    const AX = AB[0].x
    const AY = AB[0].y
    const BX = AB[1].x
    const BY = AB[1].y
    const CX = CD[0].x
    const CY = CD[0].y
    const DX = CD[1].x
    const DY = CD[1].y

    const tNumerator =
      AY * DX -
      CY * DX -
      AY * CX +
      CY * CX -
      AX * DY +
      CX * DY +
      AX * CY -
      CX * CY
    const tDivider =
      BX * DY -
      AX * DY -
      BX * CY +
      AX * CY -
      BY * DX +
      AY * DX +
      BY * CX -
      AY * CX
    const uNumerator =
      CX * BY -
      AX * BY -
      CX * AY +
      AX * AY -
      CY * BX +
      AY * BX +
      CY * AX -
      AY * AX
    const uDivider =
      DY * BX -
      CY * BX -
      DY * AX +
      CY * AX -
      DX * BY +
      CX * BY +
      DX * AY -
      CX * AY

    const t = tNumerator / tDivider
    const u = uNumerator / uDivider

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && tDivider !== 0) {
      return {
        x: this.lerp(AB[0].x, AB[1].x, t),
        y: this.lerp(AB[0].y, AB[1].y, t),
      }
    }

    return null
  }

  /**
   * Linear interpolation
   *
   * @param   {number} A
   * @param   {number} B
   * @param   {number} t
   * @returns {number}
   */
  static lerp(A, B, t) {
    return A + (B - A) * t
  }
}
