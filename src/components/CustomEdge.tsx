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
    let stackingOffsetY = 0;
    let stackingOffsetX = 0;
    if (data?.labelCount > 1 && typeof data.labelIndex === 'number') {
        const spacingY = 36; // vertical gap between labels (increased)
        const spacingX = 18; // horizontal step for 'steps' effect
        stackingOffsetY = (data.labelIndex - (data.labelCount - 1) / 2) * spacingY;
        stackingOffsetX = (data.labelIndex - (data.labelCount - 1) / 2) * spacingX;
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transform: `translate(-50%, -50%) translate(${labelX + stackingOffsetX}px,${labelY + stackingOffsetY}px)`,
                            background: '#fff',
                            padding: '2px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            pointerEvents: 'all',
                            border: `2px solid ${style.stroke}`,
                            color: style.stroke,
                            boxShadow: `0 2px 8px ${style.stroke || '#888'}33`,
                            zIndex: 10,
                            animationDelay,
                            margin: '4px 0',
                            backgroundClip: 'padding-box',
                        }}
                        className="nodrag nopan animate-fade-in"
                        onMouseOver={data?.onMouseOver}
                        onMouseLeave={data?.onMouseLeave}
                    >
                        {data?.labelCount > 1 && typeof data.labelIndex === 'number' && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 18,
                                    height: 18,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    borderRadius: '50%',
                                    background: style.stroke,
                                    color: '#fff',
                                    marginRight: 4,
                                    flexShrink: 0,
                                }}
                            >
                                {data.labelIndex + 1}
                            </span>
                        )}
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
        </g>
    );
};

export default CustomEdge;
