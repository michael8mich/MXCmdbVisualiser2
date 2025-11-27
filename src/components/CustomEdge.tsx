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
}: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: '#ffffff',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            pointerEvents: 'all',
                            border: `1px solid ${style.stroke}`,
                            color: style.stroke,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            zIndex: 10,
                        }}
                        className="nodrag nopan"
                    >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};

export default CustomEdge;
