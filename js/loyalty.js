/**
 * loyalty.js — Bookly Loyalty Points System
 * Tích điểm khi mua hàng, đổi voucher giảm giá
 * 1.000đ = 1 điểm | 100 điểm = 10.000đ giảm giá
 */

const getStorageUser = () => {
    try { return JSON.parse(localStorage.getItem('bookly_currentUser')); }
    catch { return null; }
};

const getUserScope = () => {
    const user = getStorageUser();
    return user?.id ? `user_${user.id}` : 'guest';
};

const getStorageKey = () => `bookly_loyalty_${getUserScope()}`;

const RATE_EARN = 1;       // 1 điểm / 1.000đ
const RATE_REDEEM = 100;   // 100 điểm = 10.000đ

const TIERS = [
    { name: 'Đồng', min: 0,    max: 499,  color: '#cd7f32', icon: '🥉' },
    { name: 'Bạc',  min: 500,  max: 1499, color: '#c0c0c0', icon: '🥈' },
    { name: 'Vàng', min: 1500, max: 2999, color: '#ffd700', icon: '🥇' },
    { name: 'Kim Cương', min: 3000, max: Infinity, color: '#b9f2ff', icon: '💎' }
];

const getStore = () => {
    try {
        return JSON.parse(localStorage.getItem(getStorageKey())) || { points: 0, history: [], totalEarned: 0 };
    } catch {
        return { points: 0, history: [], totalEarned: 0 };
    }
};

const saveStore = (data) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
};

export const getPoints = () => getStore().points;

export const getTotalEarned = () => getStore().totalEarned;

export const getHistory = () => getStore().history;

export const getTier = (points = null) => {
    const p = points ?? getTotalEarned();
    return TIERS.find(t => p >= t.min && p <= t.max) || TIERS[0];
};

export const getNextTier = () => {
    const earned = getTotalEarned();
    const idx = TIERS.findIndex(t => earned >= t.min && earned <= t.max);
    return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
};

export const calcEarnPoints = (totalAmount) => {
    return Math.floor(totalAmount / 1000) * RATE_EARN;
};

export const calcRedeemValue = (points) => {
    return Math.floor(points / RATE_REDEEM) * 10000;
};

/**
 * Cộng điểm sau khi mua hàng thành công
 * @param {number} orderTotal - Tổng đơn hàng (VNĐ)
 * @param {string} orderId - Mã đơn hàng
 */
export const earnPoints = (orderTotal, orderId) => {
    const earned = calcEarnPoints(orderTotal);
    if (earned <= 0) return 0;

    const store = getStore();
    store.points += earned;
    store.totalEarned = (store.totalEarned || 0) + earned;
    store.history.unshift({
        type: 'earn',
        points: earned,
        desc: `Tích điểm đơn hàng ${orderId}`,
        date: new Date().toLocaleDateString('vi-VN'),
        orderId
    });
    saveStore(store);
    return earned;
};

/**
 * Dùng điểm để giảm giá
 * @param {number} pointsToUse - Số điểm muốn dùng
 * @returns {{ success: boolean, discount: number, message: string }}
 */
export const redeemPoints = (pointsToUse) => {
    const store = getStore();
    if (pointsToUse > store.points) {
        return { success: false, discount: 0, message: 'Không đủ điểm' };
    }
    if (pointsToUse % RATE_REDEEM !== 0) {
        return { success: false, discount: 0, message: `Phải dùng bội số ${RATE_REDEEM} điểm` };
    }

    const discount = calcRedeemValue(pointsToUse);
    store.points -= pointsToUse;
    store.history.unshift({
        type: 'redeem',
        points: -pointsToUse,
        desc: `Đổi ${pointsToUse} điểm lấy ${discount.toLocaleString('vi-VN')}đ`,
        date: new Date().toLocaleDateString('vi-VN'),
    });
    saveStore(store);
    return { success: true, discount, message: `Đã trừ ${pointsToUse} điểm, giảm ${discount.toLocaleString('vi-VN')}đ` };
};

/**
 * Render loyalty widget (mini) vào container
 */
export const renderLoyaltyMini = (containerId) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const pts = getPoints();
    const tier = getTier();
    const next = getNextTier();
    const earned = getTotalEarned();
    const progress = next ? Math.round(((earned - tier.min) / (next.min - tier.min)) * 100) : 100;

    el.innerHTML = `
        <div class="loyalty-mini-card">
            <div class="loyalty-mini-header">
                <span class="loyalty-tier-badge" style="background: ${tier.color}20; color: ${tier.color}; border: 1px solid ${tier.color}40;">
                    ${tier.icon} ${tier.name}
                </span>
                <span class="loyalty-pts-total">${pts.toLocaleString('vi-VN')} điểm</span>
            </div>
            ${next ? `
            <div class="loyalty-progress-wrap">
                <div class="loyalty-progress-bar-bg">
                    <div class="loyalty-progress-bar-fill" style="width: ${progress}%; background: ${tier.color};"></div>
                </div>
                <div class="loyalty-progress-label">
                    <span>${earned.toLocaleString('vi-VN')} / ${next.min.toLocaleString('vi-VN')} điểm</span>
                    <span>→ ${next.icon} ${next.name}</span>
                </div>
            </div>` : `<div style="font-size:0.85rem; color: ${tier.color}; margin-top:6px;">🎉 Hạng cao nhất!</div>`}
            <div class="loyalty-redeem-info">
                💡 100 điểm = giảm 10.000đ | 1.000đ mua = 1 điểm
            </div>
        </div>
    `;
};

/**
 * Render trang lịch sử điểm đầy đủ vào container
 */
export const renderLoyaltyFull = (containerId) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const pts = getPoints();
    const tier = getTier();
    const next = getNextTier();
    const earned = getTotalEarned();
    const history = getHistory();
    const progress = next ? Math.round(((earned - tier.min) / (next.min - tier.min)) * 100) : 100;

    el.innerHTML = `
        <div class="loyalty-full-wrap">
            <div class="loyalty-hero-card" style="background: linear-gradient(135deg, ${tier.color}22, ${tier.color}08); border: 1px solid ${tier.color}30;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <div class="loyalty-tier-badge-lg" style="background: ${tier.color}20; color: ${tier.color}; border: 1px solid ${tier.color}50;">
                            ${tier.icon} Hạng ${tier.name}
                        </div>
                        <div class="loyalty-pts-big">${pts.toLocaleString('vi-VN')}</div>
                        <div class="loyalty-pts-label">điểm khả dụng</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 4px;">Tổng tích lũy</div>
                        <div style="font-size: 1.4rem; font-weight: 700;">${earned.toLocaleString('vi-VN')} điểm</div>
                        <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 4px;">= ${(calcRedeemValue(Math.floor(pts / RATE_REDEEM) * RATE_REDEEM)).toLocaleString('vi-VN')}đ có thể đổi</div>
                    </div>
                </div>
                ${next ? `
                <div style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; opacity: 0.7; margin-bottom: 6px;">
                        <span>Tiến độ lên hạng ${next.icon} ${next.name}</span>
                        <span>${(next.min - earned).toLocaleString('vi-VN')} điểm nữa</span>
                    </div>
                    <div class="loyalty-progress-bar-bg">
                        <div class="loyalty-progress-bar-fill" style="width: ${progress}%; background: ${tier.color};"></div>
                    </div>
                </div>` : ''}
            </div>

            <div class="loyalty-tiers-row">
                ${TIERS.map(t => `
                    <div class="loyalty-tier-item ${earned >= t.min ? 'active' : ''}" style="border-color: ${earned >= t.min ? t.color+'60' : 'transparent'};">
                        <span>${t.icon}</span>
                        <span style="font-weight:600; color: ${earned >= t.min ? t.color : 'inherit'};">${t.name}</span>
                        <span style="font-size:0.75rem; opacity:0.6;">${t.min.toLocaleString()}+ điểm</span>
                    </div>
                `).join('')}
            </div>

            <div class="loyalty-history">
                <h4 style="margin-bottom: 16px; font-size: 1rem;">📋 Lịch sử điểm</h4>
                ${history.length === 0 ? `<div style="text-align:center; opacity:0.5; padding: 24px;">Chưa có giao dịch điểm nào</div>` :
                    history.slice(0, 10).map(h => `
                        <div class="loyalty-history-item">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div class="loyalty-history-icon ${h.type === 'earn' ? 'earn' : 'redeem'}">
                                    ${h.type === 'earn' ? '+' : '-'}
                                </div>
                                <div>
                                    <div style="font-size:0.9rem; font-weight:500;">${h.desc}</div>
                                    <div style="font-size:0.78rem; opacity:0.55;">${h.date}</div>
                                </div>
                            </div>
                            <div class="loyalty-history-pts ${h.type === 'earn' ? 'earn' : 'redeem'}">
                                ${h.type === 'earn' ? '+' : ''}${h.points.toLocaleString('vi-VN')} điểm
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
};
