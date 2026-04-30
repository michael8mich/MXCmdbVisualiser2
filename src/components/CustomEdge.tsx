import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from 'reactflow';

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
    data,
}: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const animationDelay = data?.animationDelay || '0s';

    // Calculate vertical stacking offset for multiple labels between same nodes
    let stackingOffset = 0;
    if (data?.labelCount > 1 && typeof data.labelIndex === 'number') {
        const spacing = 22; // px between stacked labels
        stackingOffset = (data.labelIndex - (data.labelCount - 1) / 2) * spacing;
    }

    return (
        <g
            className="animate-fade-in"
            style={{ animationDelay }}
        >
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
            <circle r="4" fill={style.stroke || '#f5576c'}>
                <animateMotion dur="2s" repeatCount="indefinite" path={edgePath}>
                    <mpath href={`#${id}`} />
                </animateMotion>
            </circle>
            {label && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + stackingOffset}px)`,
                            background: '#fff',
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            pointerEvents: 'all',
                            border: `2px solid ${style.stroke}`,
                            color: style.stroke,
                            boxShadow: `0 2px 8px ${style.stroke || '#888'}33`,
                            zIndex: 10,
                            animationDelay,
                            margin: '2px 0',
                            backgroundClip: 'padding-box',
                        }}
                        className="nodrag nopan animate-fade-in"
                        onMouseOver={data?.onMouseOver}
                        onMouseLeave={data?.onMouseLeave}
                    >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
        </g>
    );
};

export default CustomEdge;
