export default function positionElement(anchorId, targetId, position, offsetX = 0, offsetY = 0) {
    console.log(`Positioning element: anchorId=${anchorId}, targetId=${targetId}, position=${position}`);
    const anchor = document.getElementById(anchorId);
    const target = document.getElementById(targetId);

    if (!anchor || !target) {
        console.error(`Invalid anchor or target element: ${anchorId}, ${targetId}`);
        return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    console.log(`Anchor Rect:`, anchorRect);
    console.log(`Target Rect:`, targetRect);

    // Add orange border to both elements


    // Calculate the center of the anchor
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;

    switch (position) {
        case 'top':
            // Position the target such that its center aligns with the top center of the anchor
            target.style.top = `${anchorRect.top - targetRect.height + offsetY}px`;
            target.style.left = `${anchorCenterX - targetRect.width / 2 + offsetX}px`;
            break;
        case 'bottom':
            // Position the target such that its center aligns with the bottom center of the anchor
            target.style.top = `${anchorRect.bottom + offsetY}px`;
            target.style.left = `${anchorCenterX - targetRect.width / 2 + offsetX}px`;
            break;
        case 'left':
            // Position the target such that its center aligns with the left center of the anchor
            target.style.top = `${anchorCenterY - targetRect.height / 2 + offsetY}px`;
            target.style.left = `${anchorRect.left - targetRect.width + offsetX}px`;
            break;
        case 'right':
            // Position the target such that its center aligns with the right center of the anchor
            target.style.top = `${anchorCenterY - targetRect.height / 2 + offsetY}px`;
            target.style.left = `${anchorRect.right + offsetX}px`;
            break;
        default:
            console.error(`Invalid position: ${position}`);
    }

    // Apply the positioning as absolute
    target.style.position = 'absolute';
}