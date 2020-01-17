import * as React from 'react';
import s from './ImageFitSkin.scss';
import { ImageFitter } from './ImageFitter';

interface ImageFitSkinProps {
  image: string;
  onSave(position: any): void;
  initialPosition?: { x?: number; y?: number };
}

interface State {
  dragging: boolean;
}

export class ImageFit extends React.Component<ImageFitSkinProps, State> {
  static displayName: string = 'ImageFit';
  state: State = {
    dragging: false,
  };
  private readonly imageRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();
  private positionY: number = 50;
  private readonly imageFitter: ImageFitter = new ImageFitter();

  constructor(props: Readonly<ImageFitSkinProps>) {
    super(props);
    this.setInitialPosition();
  }

  componentDidMount(): void {
    if (this.imageRef.current) {
      this.imageFitter.setupDragging(this.imageRef.current);
    }
  }

  private setInitialPosition() {
    const { initialPosition } = this.props;
    if (initialPosition && initialPosition.y !== null) {
      const y = Number(initialPosition.y);
      this.positionY = y >= 0 ? y : 50;
    }
  }

  componentWillUnmount(): void {
    this.imageFitter.unsetDragging();
  }

  render() {
    const { image } = this.props;
    const style = {
      backgroundImage: `url(${image})`,
      backgroundPositionY: `${this.positionY}%`,
    };
    return (
      <div className={s.root}>
        {this.state.dragging ? (
          <div>
            <button onClick={this.onSave}>Save</button>
            <button onClick={this.onCancel}>Cancel</button>
          </div>
        ) : (
          <div>
            <button onClick={this.onStartDragging}>Drag</button>
          </div>
        )}
        <div className={s.imageFit} style={style} ref={this.imageRef} />
      </div>
    );
  }

  private readonly onStartDragging = () =>
    this.setState({ dragging: true }, this.onDragChange);

  private readonly onStopDragging = () =>
    this.setState({ dragging: false }, this.onDragChange);

  private readonly onSave = () => {
    this.setPosition();
    this.onStopDragging();
    this.props.onSave(this.positionY);
  };

  private readonly onCancel = () => {
    this.setBackground();
    this.onStopDragging();
  };

  private setPosition() {
    if (this.imageRef.current) {
      this.positionY = parseFloat(
        this.imageRef.current.style.backgroundPositionY || '',
      );
    }
  }

  private setBackground() {
    if (this.imageRef.current) {
      this.imageRef.current.style.backgroundPositionY = `${this.positionY}%`;
    }
  }

  private readonly onDragChange = () => {
    this.imageFitter.setDragging(this.state.dragging);
  };
}
