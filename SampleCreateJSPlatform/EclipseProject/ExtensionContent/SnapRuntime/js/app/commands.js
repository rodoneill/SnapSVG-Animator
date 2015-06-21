/*global define $ requestAnimationFrame*/

define(function (require) {
	
	var CMD = {};
    
    require(['app/shape', 'app/movieclip'], function (Shape, MovieClip) {

        //PlaceObjectCommand Class
        CMD.PlaceObjectCommand = function(charID, objectID, placeAfter, transform) 
        {
            this.m_charID = charID;
            this.m_objectID = objectID;
            this.m_placeAfter = placeAfter;
            this.m_transform = transform;
        };

        //Execute function for PlaceObjectCommand
        CMD.PlaceObjectCommand.prototype.execute = function(parentMC, resourceManager)
        {
            
            var shape = resourceManager.getShape(this.m_charID),
                bitmap = resourceManager.getBitmap(this.m_charID),
                text = resourceManager.getText(this.m_charID),
                movieclipTimeline,
                movieclip;

            if(shape !== null && shape !== undefined)
            {
                shapeObject = new Shape(parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform);
                parentMC.children.push(shapeObject);
            } 
            else if(bitmap !== null && bitmap !== undefined)
            {
                //Utils.CreateBitmap(root, parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform);
            }
            else if (text !== null && text !== undefined) 
            {
                //Utils.CreateText(root, parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform);
            }
            else
            {
                movieclipTimeline = resourceManager.getMovieClip(this.m_charID);
                if(movieclipTimeline)
                {
                    movieclip = new MovieClip(parentMC, movieclipTimeline, resourceManager, this.m_objectID, this.m_placeAfter, this.m_transform);
                    parentMC.children.push(movieclip);
                    movieclip.play(resourceManager);
                }
            }

        };

        //MoveObjectCommand Class
        CMD.MoveObjectCommand = function(objectID, transform) 
        {
            this.m_objectID = objectID;
            //this.m_placeAfter = placeAfter;
            this.m_transform = transform;	
        };

        //Execute function for PlaceObjectCommand
        CMD.MoveObjectCommand.prototype.execute = function(parentMC, resourceManager)
        {
            var transform,
                transformArray,
                transformMat;
                
            transform =  this.m_transform;
            transformArray = transform.split(",");
            transformMat = new Snap.Matrix(transformArray[0],transformArray[1],transformArray[2],transformArray[3],transformArray[4],transformArray[5]);

            child = parentMC.getChildById(this.m_objectID);
            child.el.transform(transformMat);
        };

        //UpdateObjectCommand Class
        CMD.UpdateObjectCommand = function(objectID, placeAfter) 
        {
            this.m_objectID = objectID;
            this.m_placeAfter = placeAfter;
        };

        //Execute function for UpdateObjectCommand
        CMD.UpdateObjectCommand.prototype.execute = function(timelineAnimator, resourceManager)
        {
            /*
            var parentMC = timelineAnimator.s;

            if(parentMC != undefined)
            {
                //Change the Z order of the targetMC
                var index;							
                for(var indexz=0; indexz<parentMC.children.length; indexz++)
                {
                    if(parentMC.children[indexz].id == parseInt(this.m_objectID))
                    {
                        var child = parentMC.getChildAt(indexz);
                        if(this.m_placeAfter != 0)
                        {					
                            for(var index=0; index<parentMC.children.length; index++)
                            {
                                if(parentMC.children[index].id == parseInt(this.m_placeAfter))
                                {
                                    //child.addChildAt(childMC,index);
                                    parentMC.setChildIndex(child,index - 1)
                                    break;
                                }				
                            }
                        }				
                        break;
                    }				
                }		
            }
            */
        };

        //RemoveObjectCommand Class
        CMD.RemoveObjectCommand = function(objectID) 
        {
            this.m_objectID = objectID;	
        };

        //Execute function for RemoveObjectCommand
        CMD.RemoveObjectCommand.prototype.execute = function(parentMC, resourceManager)
        {
            var child;

            child = parentMC.getChildById(this.m_objectID);
            child.el.remove();
            parentMC.removeChildById(this.m_objectID);
        };

        //UpdateVisbilityCommand Class
        CMD.UpdateVisibilityCommand = function(objectID,visibility) 
        {
            this.m_objectID = objectID;	
            this.m_visibility = visibility;
        };

        //Execute function for UpdateVisbilityCommand
        CMD.UpdateVisibilityCommand.prototype.execute = function(parentMC, resourceManager)
        {
            var child,
                visibleValue;

            child = parentMC.getChildById(this.m_objectID);
            visibleValue = this.m_visibility == "true" ? "visible" : "hidden";
            child.el.attr({'visibility': visibleValue});
        };
        
        CMD.UpdateMaskCommand = function (objectID,maskTill) 
        {
            this.m_objectID = objectID;
            this.m_maskTill = maskTill;
        };

        CMD.UpdateMaskCommand.prototype.execute = function (parentMC, resourceManager) 
        {
            /*
            var parentMC = stage.el,
                root = stage.root,
                mask,
                maskContent,
                masked,
                i,
                def,
                clone;
            
            if(parentMC != undefined)
            {
                maskContent = parentMC.select('[token="' + this.m_objectID + '"]');
                mask = root.mask();
                mask.attr('mask-type', 'alpha');
                mask.append(maskContent);

                def = mask.toDefs();
                
                for (i = parseInt(this.m_maskTill); i > parseInt(this.m_objectID); i -= 1) {
                    //clone = def.clone(); //issue with reusing def ??
                    masked = parentMC.select('[token="' + i + '"]');
                    masked.attr({mask: def});
                }
                
            }
            */
        };

        CMD.UpdateColorTransformCommand = function (objectID, colorMatrix)
        {
            this.m_objectID = objectID;
            this.m_colorMatrix = colorMatrix;
        };

        CMD.UpdateColorTransformCommand.prototype.execute = function (parentMC, resourceManager) 
        {
            var child,
                matrix;

            child = parentMC.getChildById(this.m_objectID);
            matrix = this.m_colorMatrix.split(',', 7);
            child.el.attr({opacity: parseFloat(matrix[6])}); //currently only alpha
        };

    });

	return CMD;
	
});